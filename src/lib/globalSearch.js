import { supabase } from "../lib/supabaseClient";

// Search results are deliberately lightweight.
// Full article/devotional content is fetched only when the user opens it.
const RESULT_LIMIT = 5;

function cleanSearchTerm(value) {
  return value
    .trim()
    .replace(/[(),."'\\*]/g, " ")
    .replace(/[%_]/g, "\\$&")
    .replace(/\s+/g, " ");
}

async function runSearch(table, columns, searchFields, term, extraFilters = []) {
  const filters = searchFields
    .map((field) => `${field}.ilike.%${term}%`)
    .join(",");

  let query = supabase
    .from(table)
    .select(columns)
    .or(filters)
    .limit(RESULT_LIMIT);

  for (const applyFilter of extraFilters) {
    query = applyFilter(query);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function searchAllContent(searchText) {
  const term = cleanSearchTerm(searchText ?? "");

  if (term.length < 2) {
    return {
      devotionals: [],
      articles: [],
      featuredArticles: [],
      forumPosts: [],
    };
  }

  const searches = await Promise.allSettled([
    runSearch(
      "devotionals",
      "id, title, category, excerpt, created_at, flyer_url",
      ["title", "category", "pure_content", "excerpt"],
      term
    ),

    runSearch(
      "articles",
      "id, title, category, created_at, image_url",
      ["title", "category", "body"],
      term
    ),

    runSearch(
      "featured_articles",
      "id, title, subtitle, published_at, hero_image_url",
      ["title", "subtitle", "body"],
      term,
      [(query) => query.eq("is_active", true)]
    ),

    runSearch(
      "forum_posts",
      "id, title, category, created_at, pinned, replies_count",
      ["title", "category", "body"],
      term
    ),
  ]);

  const names = [
    "devotionals",
    "articles",
    "featuredArticles",
    "forumPosts",
  ];

  const results = {};

  searches.forEach((result, index) => {
    if (result.status === "fulfilled") {
      results[names[index]] = result.value;
    } else {
      console.error(`Search failed for ${names[index]}:`, result.reason);
      results[names[index]] = [];
    }
  });

  return results;
}
