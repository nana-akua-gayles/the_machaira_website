import { supabase } from "./supabaseClient";

// The fixed category list. Lives here (not in a table) per our earlier
// decision — adding a category means adding it here, not a DB migration.
export const FORUM_CATEGORIES = [
  "Faith & Spirituality",
  "Prayer Requests",
  "Bible Study",
  "Christian Living",
  "Family & Relationships",
  "Youth & Young Adults",
  "Church Community",
  "Announcements",
  "Events & Programs",
];

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

// forum_posts.user_id / forum_replies.user_id point at auth.users, not
// profiles, so we can't rely on an automatic embedded join. Instead we
// batch-fetch the profiles for whatever set of user_ids we just loaded
// and merge them in manually (same pattern as commentService.js).
async function attachProfiles(rows, userIdKey = "user_id") {
  if (!rows || rows.length === 0) return rows;

  const userIds = [...new Set(rows.map((row) => row[userIdKey]))];

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, name, avatar_url")
    .in("id", userIds);

  if (error) throw error;

  const profileById = new Map(profiles.map((p) => [p.id, p]));

  return rows.map((row) => ({
    ...row,
    author: profileById.get(row[userIdKey]) || null,
  }));
}

const POST_FIELDS =
  "id, user_id, category, title, body, pinned, views, replies_count, created_at, updated_at";

// ---------------------------------------------------------------------
// Stats (hero + category sidebar)
// ---------------------------------------------------------------------

export async function getForumStats() {
  const [postsResult, repliesResult, membersResult] = await Promise.all([
    supabase.from("forum_posts").select("*", { count: "exact", head: true }),
    supabase.from("forum_replies").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  if (postsResult.error) throw postsResult.error;
  if (repliesResult.error) throw repliesResult.error;
  if (membersResult.error) throw membersResult.error;

  return {
    discussions: postsResult.count || 0,
    replies: repliesResult.count || 0,
    members: membersResult.count || 0,
  };
}

// Returns { [category]: count }, including every category from
// FORUM_CATEGORIES even if it currently has zero posts.
export async function getCategoryCounts() {
  const { data, error } = await supabase.from("forum_posts").select("category");

  if (error) throw error;

  const counts = Object.fromEntries(FORUM_CATEGORIES.map((c) => [c, 0]));

  data.forEach((row) => {
    if (counts[row.category] !== undefined) {
      counts[row.category] += 1;
    } else {
      counts[row.category] = (counts[row.category] || 0) + 1;
    }
  });

  return counts;
}

// ---------------------------------------------------------------------
// Posts (feed)
// ---------------------------------------------------------------------

// sortBy: "latest" | "trending" | "mostReplies" | "unanswered"
export async function getPosts({ category = null, sortBy = "latest", limit = 10, offset = 0 } = {}) {
  let query = supabase.from("forum_posts").select(POST_FIELDS);

  if (category && category !== "All Discussions") {
    query = query.eq("category", category);
  }

  if (sortBy === "unanswered") {
    query = query.eq("replies_count", 0);
  }

  // Pinned posts always float to the top, then the chosen sort applies
  // within each group.
  query = query.order("pinned", { ascending: false });

  if (sortBy === "trending") {
    query = query.order("views", { ascending: false });
  } else if (sortBy === "mostReplies") {
    query = query.order("replies_count", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) throw error;

  return attachProfiles(data);
}

export async function getPostById(id) {
  const { data, error } = await supabase
    .from("forum_posts")
    .select(POST_FIELDS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const [withProfile] = await attachProfiles([data]);
  return withProfile;
}

export async function createPost({ userId, category, title, body }) {
  const { data, error } = await supabase
    .from("forum_posts")
    .insert({ user_id: userId, category, title, body })
    .select(POST_FIELDS)
    .single();

  if (error) throw error;
  return data;
}

// Fire-and-forget from the post detail page. Uses the increment_post_views
// SQL function so concurrent viewers can't stomp on each other's count.
export async function incrementPostViews(postId) {
  const { error } = await supabase.rpc("increment_post_views", {
    post_id_input: postId,
  });

  if (error) throw error;
}

// ---------------------------------------------------------------------
// Replies
// ---------------------------------------------------------------------

export async function getRepliesForPost(postId) {
  const { data, error } = await supabase
    .from("forum_replies")
    .select("id, post_id, user_id, content, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return attachProfiles(data);
}

export async function createReply({ postId, userId, content }) {
  const { data, error } = await supabase
    .from("forum_replies")
    .insert({ post_id: postId, user_id: userId, content })
    .select("id, post_id, user_id, content, created_at")
    .single();

  if (error) throw error;
  return data;
  // Note: forum_posts.replies_count updates itself via the database
  // trigger, nothing else to do here.
}

// RLS restricts both of these to the reply's own author (auth.uid() =
// user_id), so a stray call against someone else's reply is rejected by
// the database even if the UI somehow allowed it.
export async function updateReply({ replyId, content }) {
  const { data, error } = await supabase
    .from("forum_replies")
    .update({ content })
    .eq("id", replyId)
    .select("id, post_id, user_id, content, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteReply(replyId) {
  const { error } = await supabase.from("forum_replies").delete().eq("id", replyId);

  if (error) throw error;
  // forum_posts.replies_count decrements itself via the same database
  // trigger that increments it on insert.
}

// ---------------------------------------------------------------------
// Sidebar widgets
// ---------------------------------------------------------------------

export async function getTrendingPosts(limit = 3) {
  const { data, error } = await supabase
    .from("forum_posts")
    .select(POST_FIELDS)
    .order("views", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return attachProfiles(data);
}

// Finds the user with the most replies overall and returns their
// profile plus a reply count, for the "Community Spotlight" widget.
// Computed client-side for now (fine at this community's size); if the
// forum grows large, this should move to a database view or RPC instead.
export async function getTopContributor() {
  const { data, error } = await supabase.from("forum_replies").select("user_id");

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const countByUser = data.reduce((acc, row) => {
    acc[row.user_id] = (acc[row.user_id] || 0) + 1;
    return acc;
  }, {});

  const topUserId = Object.entries(countByUser).sort((a, b) => b[1] - a[1])[0]?.[0];

  if (!topUserId) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, avatar_url")
    .eq("id", topUserId)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) return null;

  return { ...profile, replyCount: countByUser[topUserId] };
}