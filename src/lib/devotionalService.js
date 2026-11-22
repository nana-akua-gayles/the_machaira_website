
import { supabase } from "./supabaseClient";

const DEVOTIONAL_SELECT = `
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
`;

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
 * Convert a devotional title into a URL-safe slug.
 * Example: { episode_number: 1398, title: "Episode 1398 - The Power of Prayer" }
 * becomes: 1398-the-power-of-prayer
 */
export function createDevotionalSlug(devotional) {
  if (!devotional?.episode_number) return "";

  const episodeNumber = String(devotional.episode_number);
  const title = String(devotional.title || "");

  const escapedEpisode = episodeNumber.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const titleWithoutEpisode = title.replace(
    new RegExp(
      `^\\s*(?:episode\\s*)?${escapedEpisode}\\b[\\s:|–—.-]*`,
      "i"
    ),
    ""
  );

  const titleSlug = titleWithoutEpisode
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${episodeNumber}-${titleSlug || "devotional"}`;
}

/**
 * Return the canonical URL path for a devotional.
 */
export function getDevotionalPath(devotional) {
  const slug = createDevotionalSlug(devotional);
  return slug ? `/devotional/${slug}` : "/devotional";
}

/**
 * Extract the episode number from a URL segment.
 * Example: 1398-the-power-of-prayer -> 1398
 */
export function getEpisodeNumberFromSlug(slug) {
  const match = String(slug || "").match(/^(\d+)(?:-|$)/);
  return match ? Number(match[1]) : null;
}

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
      .select(DEVOTIONAL_SELECT)
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
      .select(DEVOTIONAL_SELECT)
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
 */
export async function getRecentDevotionals(limit = 12) {
  try {
    const { data, error } = await supabase
      .from("devotionals")
      .select(DEVOTIONAL_SELECT)
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
 */
export async function getDevotionalsByCategory(category, limit = 12) {
  try {
    const { data, error } = await supabase
      .from("devotionals")
      .select(DEVOTIONAL_SELECT)
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
 * Get one devotional by its existing UUID.
 * Retained to support old UUID links.
 */
export async function getDevotionalById(id) {
  try {
    const { data, error } = await supabase
      .from("devotionals")
      .select(DEVOTIONAL_SELECT)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching devotional by ID:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("getDevotionalById failed:", error);
    throw error;
  }
}

/**
 * Get one devotional using its episode number from the readable URL.
 */
export async function getDevotionalByEpisodeNumber(episodeNumber) {
  try {
    const episode = Number(episodeNumber);

    if (!Number.isInteger(episode) || episode <= 0) {
      return null;
    }

    const { data, error } = await supabase
      .from("devotionals")
      .select(DEVOTIONAL_SELECT)
      .eq("episode_number", episode)
      .maybeSingle();

    if (error) {
      console.error("Error fetching devotional by episode number:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("getDevotionalByEpisodeNumber failed:", error);
    throw error;
  }
}

/**
 * Get the devotional published immediately before this one.
 * episode_number is included to build its readable URL.
 */
export async function getPreviousDevotional(createdAt) {
  try {
    const { data, error } = await supabase
      .from("devotionals")
      .select("id, title, created_at, episode_number")
      .lt("created_at", createdAt)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching previous devotional:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("getPreviousDevotional failed:", error);
    throw error;
  }
}

/**
 * Get the devotional published immediately after this one.
 * episode_number is included to build its readable URL.
 */
export async function getNextDevotional(createdAt) {
  try {
    const { data, error } = await supabase
      .from("devotionals")
      .select("id, title, created_at, episode_number")
      .gt("created_at", createdAt)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching next devotional:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("getNextDevotional failed:", error);
    throw error;
  }
}

/**
 * Get devotionals for the Previous Devotional library.
 *
 * Search:
 * - Searches titles only.
 * - Uses partial, case-insensitive matching.
 *
 * Sorting:
 * - Always newest to oldest.
 *
 * Filters:
 * - Category
 * - Date range
 * - Episode range
 *
 * Pagination:
 * - Supports page sizes up to 100.
 */
export async function getDevotionals({
  page = 1,
  pageSize = 10,
  search = "",
  category = "all",
  dateFrom = "",
  dateTo = "",
  episodeFrom = "",
  episodeTo = "",
} = {}) {
  try {
    const safePage = Math.max(1, Number(page) || 1);

    const safePageSize = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10)
    );

    const from = (safePage - 1) * safePageSize;
    const to = from + safePageSize - 1;

    let query = supabase
      .from("devotionals")
      .select(
        `
          id,
          title,
          category,
          flyer_url,
          created_at,
          episode_number,
          pure_content,
          excerpt
        `,
        { count: "exact" }
      );

    const searchTerm = String(search || "").trim();

    if (searchTerm) {
      query = query.ilike("title", `%${searchTerm}%`);
    }

    if (category && category !== "all") {
      query = query.ilike(
        "category",
        `%${String(category).trim()}%`
      );
    }

    if (dateFrom) {
      query = query.gte(
        "created_at",
        `${dateFrom}T00:00:00+00:00`
      );
    }

    if (dateTo) {
      const nextDay = new Date(`${dateTo}T00:00:00+00:00`);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);

      query = query.lt(
        "created_at",
        nextDay.toISOString()
      );
    }

    if (episodeFrom !== "" && episodeFrom != null) {
      const episodeStart = Number(episodeFrom);

      if (Number.isFinite(episodeStart)) {
        query = query.gte("episode_number", episodeStart);
      }
    }

    if (episodeTo !== "" && episodeTo != null) {
      const episodeEnd = Number(episodeTo);

      if (Number.isFinite(episodeEnd)) {
        query = query.lte("episode_number", episodeEnd);
      }
    }

    query = query
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching paginated devotionals:", error);
      throw error;
    }

    return {
      data: data ?? [],
      count: count ?? 0,
    };
  } catch (error) {
    console.error("getDevotionals failed:", error);
    throw error;
  }
}
