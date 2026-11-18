
import { supabase } from "../lib/supabaseClient";

const PAGE_SIZE = 30;

function cleanSearchTerm(value) {
  return value
    .trim()
    .replace(/[%_\\]/g, "\\$&")
    .replace(/\s+/g, " ");
}

export async function searchAllContent(searchText, page = 0) {
  const term = cleanSearchTerm(searchText ?? "");

  if (term.length < 2) {
    return {
      devotionals: [],
      articles: [],
      featuredArticles: [],
      forumPosts: [],
      hasMore: false,
    };
  }

  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("devotionals")
    .select(
      "id, title, category, excerpt, created_at, flyer_url",
      { count: "exact" }
    )
    .ilike("title", `%${term}%`)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Devotional search failed:", error);
    throw error;
  }

  const devotionals = data ?? [];

  return {
    devotionals,
    articles: [],
    featuredArticles: [],
    forumPosts: [],
    hasMore: from + devotionals.length < (count ?? 0),
  };
}
