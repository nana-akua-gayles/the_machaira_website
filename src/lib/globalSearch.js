
import { supabase } from "../lib/supabaseClient";

function cleanSearchTerm(value) {
  return value
    .trim()
    .replace(/[(),."'\\*]/g, " ")
    .replace(/[%_]/g, "\\$&")
    .replace(/\s+/g, " ");
}

export async function searchAllContent(searchText) {
  const term = cleanSearchTerm(searchText ?? "");

  if (term.length < 2) {
    return {
      devotionals: [],
    };
  }

  const { data, error } = await supabase
    .from("devotionals")
    .select("id, title, category, excerpt, created_at, flyer_url")
    .ilike("title", `%${term}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Devotional search failed:", error);
    throw error;
  }

  return {
    devotionals: data ?? [],
  };
}
