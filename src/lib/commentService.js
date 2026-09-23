import { supabase } from "./supabaseClient";

/**
 * Get all comments for a devotional episode, along with each
 * commenter's profile (name + avatar), newest first.
 */
export async function getCommentsForEpisode(episodeNumber) {
  try {
    const { data: comments, error } = await supabase
      .from("devotional_comments")
      .select("id, user_id, episode_number, content, created_at, likes_count")
      .eq("episode_number", episodeNumber)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }

    if (!comments || comments.length === 0) {
      return [];
    }

    const userIds = [...new Set(comments.map((c) => c.user_id))];

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, name, avatar_url")
      .in("id", userIds);

    if (profilesError) {
      console.error("Error fetching comment authors:", profilesError);
      throw profilesError;
    }

    const profileById = new Map(profiles.map((p) => [p.id, p]));

    return comments.map((comment) => ({
      ...comment,
      author: profileById.get(comment.user_id) || null,
    }));
  } catch (error) {
    console.error("getCommentsForEpisode failed:", error);
    throw error;
  }
}

/**
 * Post a new comment on a devotional episode.
 */
export async function addComment(episodeNumber, userId, content) {
  try {
    const { data, error } = await supabase
      .from("devotional_comments")
      .insert({
        episode_number: episodeNumber,
        user_id: userId,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding comment:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("addComment failed:", error);
    throw error;
  }
}

/**
 * Set a comment's likes_count to an exact new value.
 */
export async function updateCommentLikes(commentId, newCount) {
  try {
    const { error } = await supabase
      .from("devotional_comments")
      .update({ likes_count: newCount })
      .eq("id", commentId);

    if (error) {
      console.error("Error updating comment likes:", error);
      throw error;
    }
  } catch (error) {
    console.error("updateCommentLikes failed:", error);
    throw error;
  }
}