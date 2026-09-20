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


/*
Get devotionals belonging to a category.
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

/**
 * Get the devotional published immediately before this one.
 */
export async function getPreviousDevotional(createdAt) {
  try {
    const { data, error } = await supabase
      .from("devotionals")
      .select(`id, title, created_at`)
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
 */
export async function getNextDevotional(createdAt) {
  try {
    const { data, error } = await supabase
      .from("devotionals")
      .select(`id, title, created_at`)
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
 * Get paginated devotionals for the Previous Devotionals library.
 *
 * Supports:
 * - Pagination
 * - Search
 * - Category filtering
 * - Date range filtering
 * - Episode number filtering
 * - Sorting
 *
 * Returns:
 * {
 *   data: [...],
 *   count: number
 * }
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
  sortBy = "newest",
} = {}) {
  try {
    // Make sure pagination values are safe.
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

    // -----------------------------
    // Search
    // -----------------------------
    if (search.trim()) {
      const searchTerm = search.trim();
      query = query.or(
        `title.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,pure_content.ilike.%${searchTerm}%`
      );
    }

    // -----------------------------
    // Category
    // -----------------------------
    if (category && category !== "all") {
      query = query.ilike(
        "category",
        `%${category.trim()}%`
      );
    }

    // -----------------------------
    // Date range
    // -----------------------------
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

    // -----------------------------
    // Episode range
    // -----------------------------
    if (episodeFrom) {
      query = query.gte(
        "episode_number",
        Number(episodeFrom)
      );
    }

    if (episodeTo) {
      query = query.lte(
        "episode_number",
        Number(episodeTo)
      );
    }

    // -----------------------------
    // Sorting
    // -----------------------------
    switch (sortBy) {
      case "oldest":
        query = query.order("created_at", {
          ascending: true,
        });
        break;

      case "newest":
      default:
        query = query.order("created_at", {
          ascending: false,
        });
        break;
    }

    // -----------------------------
    // Pagination
    // -----------------------------
    query = query.range(from, to);
    const { data, error, count } = await query;
    if (error) {
      console.error( "Error fetching paginated devotionals:", error );
      throw error;
    }

    return {
      data: data ?? [],
      count: count ?? 0,
    };
  } catch (error) {
    console.error("getDevotionals failed:",error);
    throw error;
  }
}