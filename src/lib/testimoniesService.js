import { supabase } from "./supabaseClient";

/**
 * Fetch testimonies from the `writtentestimonies` table,
 * joined with the `profiles` table for author info.
 *
 * @param {Object} options
 * @param {string} [options.category]   - Category filter. "All Stories" or undefined = no filter.
 * @param {string} [options.sortBy]     - "Latest" | "Most Liked" | "Most Discussed"
 * @param {string} [options.dateFilter] - "All Time" | "This Month" | "Last 3 Months" | "This Year"
 * @param {number} [options.limit]      - Page size for pagination
 * @param {number} [options.offset]     - Pagination offset
 * @returns {Promise<{ data: Array, error: Error|null }>}
 */
export async function getTestimonies({
  category,
  sortBy = "Latest",
  categorySearch, 
  dateFilter = "All Time",
  limit = 12,
  offset = 0,
} = {}) {
  let query = supabase
    .from("writtentestimonies")
    .select(
      `
      id,
      user_id,
      category,
      content,
      attached_image_url,
      is_anonymous,
      likes_count,
      comments_count,
      created_at,
      profiles:user_id (
        id,
        name,
        email,
        avatar_url
      )
    `,
      { count: "exact" }
    );

  // ----- Category filter -----
  if (category && category !== "All Stories") {
    query = query.eq("category", category);
  }
  // NEW: fuzzy search on category (from the search bar)
  if (categorySearch && categorySearch.trim()) {
    query = query.ilike("category", `%${categorySearch.trim()}%`);
  }

  // ----- Date filter -----
  const now = new Date();
  if (dateFilter === "This Month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    query = query.gte("created_at", start.toISOString());
  } else if (dateFilter === "Last 3 Months") {
    const start = new Date(now);
    start.setMonth(start.getMonth() - 3);
    query = query.gte("created_at", start.toISOString());
  } else if (dateFilter === "This Year") {
    const start = new Date(now.getFullYear(), 0, 1);
    query = query.gte("created_at", start.toISOString());
  }

  // ----- Sorting -----
  if (sortBy === "Most Liked") {
    query = query.order("likes_count", { ascending: false });
  } else if (sortBy === "Most Discussed") {
    query = query.order("comments_count", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  // ----- Pagination -----
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("[testimoniesService] getTestimonies error:", error);
    return { data: [], error, count: 0 };
  }

  return { data: data ?? [], error: null, count: count ?? 0 };
}

/**
 * Fetch a single testimony by id (with author profile).
 */
export async function getTestimonyById(id) {
  const { data, error } = await supabase
    .from("writtentestimonies")
    .select(
      `
      id,
      user_id,
      category,
      content,
      attached_image_url,
      is_anonymous,
      likes_count,
      comments_count,
      created_at,
      profiles:user_id (
        id,
        name,
        email,
        avatar_url
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("[testimoniesService] getTestimonyById error:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Aggregate stats for the "Testimonies Impact" sidebar card.
 * Uses HEAD-count requests so we don't pull rows down.
 */
export async function getTestimonyStats() {
  const [storiesRes, likesRes] = await Promise.all([
    supabase
      .from("writtentestimonies")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("writtentestimonies")
      .select("likes_count"),
  ]);

  const storiesShared = storiesRes.count ?? 0;

  const livesInspired = (likesRes.data ?? []).reduce(
    (sum, row) => sum + (row.likes_count ?? 0),
    0
  );

  // Countries isn't derivable from the schema yet — placeholder until you
  // have a country field on profiles or a separate stats table.
  const countriesReached = 98;

  return {
    data: [
      { value: storiesShared.toLocaleString(), label: "Stories Shared", icon: "users" },
      { value: livesInspired.toLocaleString(), label: "Lives Inspired", icon: "heart" },
      { value: countriesReached.toLocaleString(), label: "Countries Reached", icon: "flame" },
    ],
    error: null,
  };
}





/**
 * Upload a testimony image to Supabase Storage.
 * Returns the public URL, or null on error.
 *
 * NOTE: requires a storage bucket named "testimony-media" to exist
 * and be configured as public-read, private-write.
 */
export async function uploadTestimonyImage(file, userId) {
  if (!file) return { url: null, error: null };

  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("testimony-media")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    console.error("[testimoniesService] uploadTestimonyImage error:", uploadError);
    return { url: null, error: uploadError };
  }

  const { data } = supabase.storage
    .from("testimony-media")
    .getPublicUrl(path);

  return { url: data.publicUrl, error: null };
}

/**
 * Create a new testimony row.
 *
 * @param {Object} payload
 * @param {string} payload.user_id
 * @param {string} payload.category
 * @param {string} payload.content
 * @param {string|null} [payload.attached_image_url]
 * @param {boolean} [payload.is_anonymous]
 */
export async function createTestimony({
  user_id,
  category,
  content,
  attached_image_url = null,
  is_anonymous = false,
}) {
  const { data, error } = await supabase
    .from("writtentestimonies")
    .insert([
      {
        user_id,
        category,
        content,
        attached_image_url,
        is_anonymous,
        likes_count: 0,
        comments_count: 0,
      },
    ])
    .select(
      `
      id,
      user_id,
      category,
      content,
      attached_image_url,
      is_anonymous,
      likes_count,
      comments_count,
      created_at,
      profiles:user_id (
        id,
        name,
        email,
        avatar_url
      )
    `
    )
    .single();

  if (error) {
    console.error("[testimoniesService] createTestimony error:", error);
    return { data: null, error };
  }

  return { data, error: null };
}