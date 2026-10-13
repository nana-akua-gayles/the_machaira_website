import { supabase } from "./supabaseClient";

/**
 * Get all comments for a devotional episode, along with each
 * commenter's profile (name + avatar), newest first.
 */
export async function getCommentsForEpisode(episodeNumber) {
  try {
    const { data: comments, error } = await supabase
      .from("devotional_comments")
      .select("id, user_id, episode_number, content, created_at, likes_count, parent_id")
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
 * Pass parentId to post it as a reply to another comment.
 */
export async function addComment(episodeNumber, userId, content, parentId = null) {
  try {
    const row = {
      episode_number: episodeNumber,
      user_id: userId,
      content,
    };
    if (parentId) row.parent_id = parentId;

    const { data, error } = await supabase
      .from("devotional_comments")
      .insert(row)
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
 * Get the ids of the comments in an episode that this user has liked.
 */
export async function getLikedCommentIds(userId, episodeNumber) {
  try {
    const { data, error } = await supabase
      .from("devotional_comment_likes")
      .select("comment_id, devotional_comments!inner(episode_number)")
      .eq("user_id", userId)
      .eq("devotional_comments.episode_number", episodeNumber);

    if (error) {
      console.error("Error fetching liked comments:", error);
      throw error;
    }

    return (data || []).map((row) => row.comment_id);
  } catch (error) {
    console.error("getLikedCommentIds failed:", error);
    throw error;
  }
}

/**
 * Like a comment as this user. Returns false if they had already liked it.
 */
export async function likeComment(commentId, userId) {
  try {
    const { error } = await supabase
      .from("devotional_comment_likes")
      .insert({ comment_id: commentId, user_id: userId });

    if (error) {
      if (error.code === "23505") return false;
      console.error("Error liking comment:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("likeComment failed:", error);
    throw error;
  }
}

/**
 * Remove this user's like from a comment. Returns false if there was none.
 */
export async function unlikeComment(commentId, userId) {
  try {
    const { data, error } = await supabase
      .from("devotional_comment_likes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", userId)
      .select("comment_id");

    if (error) {
      console.error("Error unliking comment:", error);
      throw error;
    }

    return Boolean(data && data.length > 0);
  } catch (error) {
    console.error("unlikeComment failed:", error);
    throw error;
  }
}

/**
 * Change the text of a comment. Only the comment's own author can do this.
 */
export async function editComment(commentId, userId, content) {
  try {
    const { data, error } = await supabase
      .from("devotional_comments")
      .update({ content })
      .eq("id", commentId)
      .eq("user_id", userId)
      .select("id, content")
      .maybeSingle();

    if (error) {
      console.error("Error editing comment:", error);
      throw error;
    }

    if (!data) {
      throw new Error("We couldn't edit this comment.");
    }

    return data;
  } catch (error) {
    console.error("editComment failed:", error);
    throw error;
  }
}

/**
 * Delete a comment (and its replies). Only the comment's own author can do this.
 */
export async function deleteComment(commentId, userId) {
  try {
    const { data, error } = await supabase
      .from("devotional_comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", userId)
      .select("id");

    if (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("We couldn't delete this comment.");
    }
  } catch (error) {
    console.error("deleteComment failed:", error);
    throw error;
  }
}