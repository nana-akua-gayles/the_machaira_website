import { supabase } from "./supabaseClient";

/**
 * Get today's date in Ghana (UTC).
 * Ghana uses UTC, so this keeps the devotional date consistent.
 */
function getGhanaDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  const values = {};

  parts.forEach(({ type, value }) => {
    if (type !== "literal") {
      values[type] = value;
    }
  });

  return {
    year: values.year,
    month: values.month,
    day: values.day,
  };
}

/**
 * Get today's devotional.
 *
 * We use created_at as the devotional date.
 *
 * Returns:
 * - devotional object if one exists
 * - null if no devotional has been created today
 */
export async function getTodaysDevotional() {
  try {
    const { year, month, day } = getGhanaDateParts();
    const startOfDay = `${year}-${month}-${day}T00:00:00+00:00`;
    const tomorrow = new Date(
      Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day) + 1
      )
    );
    const endOfDay = tomorrow.toISOString();
    const { data, error } = await supabase
      .from("devotionals")
      .select(`
        id,
        title,
        category,
        flyer_url,
        created_at,
        updated_at,
        episode_number,
        content,
        pure_content,
        audio_url,
        excerpt
      `)
      .gte("created_at", startOfDay)
      .lt("created_at", endOfDay)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.error("Error fetching today's devotional:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("getTodaysDevotional failed:", error);
    throw error;
  }
}

/**
 * Get a devotional for a specific date.
 *
 * Example:
 * getDevotionalByDate("2026-09-01")
 */
export async function getDevotionalByDate(dateString) {
  try {
    const startOfDay = `${dateString}T00:00:00+00:00`;
    const [year, month, day] = dateString.split("-");
    const nextDay = new Date(
      Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day) + 1
      )
    );
    const endOfDay = nextDay.toISOString();
    const { data, error } = await supabase
      .from("devotionals")
      .select(`
        id,
        title,
        category,
        flyer_url,
        created_at,
        updated_at,
        episode_number,
        content,
        pure_content,
        audio_url,
        excerpt
      `)
      .gte("created_at", startOfDay)
      .lt("created_at", endOfDay)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.error("Error fetching devotional by date:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("getDevotionalByDate failed:", error);
    throw error;
  }
}


/**
 * Get recent devotionals.
 *
 * This will eventually power the devotional library.
 */
export async function getRecentDevotionals(limit = 12) {
  try {
    const { data, error } = await supabase
      .from("devotionals")
      .select(`
        id,
        title,
        category,
        flyer_url,
        created_at,
        updated_at,
        episode_number,
        content,
        pure_content,
        audio_url,
        excerpt
      `)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.error("Error fetching recent devotionals:", error);
      throw error;
    }
    return data ?? [];
  } catch (error) {
    console.error("getRecentDevotionals failed:", error);
    throw error;
  }
}


/**
 * Get devotionals belonging to a category.
 *
 * Example:
 * getDevotionalsByCategory("Grace")
 */
export async function getDevotionalsByCategory(category, limit = 12) {
  try {
    const { data, error } = await supabase
      .from("devotionals")
      .select(`
        id,
        title,
        category,
        flyer_url,
        created_at,
        updated_at,
        episode_number,
        content,
        pure_content,
        audio_url,
        excerpt
      `)
      .eq("category", category)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.error("Error fetching devotionals by category:", error);
      throw error;
    }
    return data ?? [];
  } catch (error) {
    console.error("getDevotionalsByCategory failed:", error);
    throw error;
  }
}


/**
 * Get one devotional by its ID.
 */
export async function getDevotionalById(id) {
  try {
    const { data, error } = await supabase
      .from("devotionals")
      .select(`
        id,
        title,
        category,
        flyer_url,
        created_at,
        updated_at,
        episode_number,
        content,
        pure_content,
        audio_url,
        excerpt
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching devotional:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("getDevotionalById failed:", error);
    throw error;
  }
}