
import { supabase } from "./supabaseClient";

export const STREAK_EVENT = "machaira:streak-updated";
export const MONTHLY_ACTIVITY_EVENT = "machaira:monthly-activity-updated";

const MAX_DAYS = 90;
const storageKey = (userId) => `machaira:read-days:${userId}`;

export function getGhanaDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export function isTodaysDevotional(publishedAt) {
  if (!publishedAt) return false;

  return String(publishedAt).slice(0, 10) === getGhanaDateString();
}

export function getReadDays(userId) {
  if (!userId) return [];

  try {
    const parsed = JSON.parse(
      localStorage.getItem(storageKey(userId)) || "[]"
    );

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveReadDay(userId, dateStr) {
  try {
    const days = getReadDays(userId);

    if (days.includes(dateStr)) return;

    const updated = [...days, dateStr].sort().slice(-MAX_DAYS);

    localStorage.setItem(storageKey(userId), JSON.stringify(updated));
  } catch (error) {
    console.warn("[streak] local history could not be saved:", error);
  }
}

export async function recordDevotionalActivity(publishedAt, episodeNumber) {
  if (!isTodaysDevotional(publishedAt)) {
    console.log("[devotional activity] skipped: not today's devotional");
    return null;
  }

  const normalizedEpisodeNumber = Number(episodeNumber);

  if (
    !Number.isInteger(normalizedEpisodeNumber) ||
    normalizedEpisodeNumber <= 0
  ) {
    console.error("[devotional activity] invalid episode number");
    return null;
  }

  let user;

  try {
    const {
      data: { user: authenticatedUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!authenticatedUser) {
      console.warn("[devotional activity] skipped: not logged in");
      return null;
    }

    user = authenticatedUser;
  } catch (error) {
    console.error("[devotional activity] authentication failed:", error);
    return null;
  }

  let monthlyData = null;
  let streakData = null;
  let monthlyError = null;
  let streakError = null;

  // Record monthly challenge activity independently.
  try {
    const { data, error } = await supabase.rpc(
      "record_devotional_reading_day",
      {
        p_episode_number: normalizedEpisodeNumber,
      }
    );

    if (error) throw error;
    if (!data) throw new Error("Monthly activity function returned no result.");

    monthlyData = data;

    console.log("[monthly activity] result:", monthlyData);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(MONTHLY_ACTIVITY_EVENT));
    }
  } catch (error) {
    monthlyError = error;
    console.error("[monthly activity] failed:", error);
  }

  // Preserve the existing global streak independently.
  try {
    const { data, error } = await supabase.rpc(
      "increment_user_streak",
      {
        p_user_id: user.id,
      }
    );

    if (error) throw error;
    if (!data) throw new Error("The streak function returned no result.");

    streakData = data;

    console.log("[streak] result:", streakData);

    const today = getGhanaDateString();

    saveReadDay(user.id, today);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(STREAK_EVENT));
    }
  } catch (error) {
    streakError = error;
    console.error("[streak] failed:", error);
  }

  // Return null if either operation failed.
  // Both operations are safe to retry because their database
  // functions prevent duplicate daily activity.
  if (monthlyError || streakError) {
    console.error(
      "[devotional activity] incomplete recording. A retry is safe."
    );

    return null;
  }

  return {
    ...streakData,
    monthlyActivity: monthlyData,
  };
}
