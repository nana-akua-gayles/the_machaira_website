import { supabase } from "./supabaseClient";

export const STREAK_EVENT = "machaira:streak-updated";

const MAX_DAYS = 90;
const storageKey = (userId) => `machaira:read-days:${userId}`;

export const toDateString = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function isTodaysDevotional(publishedAt) {
  if (!publishedAt) return false;
  return String(publishedAt).slice(0, 10) === toDateString(new Date());
}

export function getReadDays(userId) {
  if (!userId) return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(userId)) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveReadDay(userId, dateStr) {
  try {
    const days = getReadDays(userId);
    if (days.includes(dateStr)) return;
    localStorage.setItem(storageKey(userId), JSON.stringify([...days, dateStr].sort().slice(-MAX_DAYS)));
  } catch {}
}

export async function recordDevotionalActivity(publishedAt) {
  if (!isTodaysDevotional(publishedAt)) {
    console.log("[streak] skipped: not today's devotional");
    return null;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn("[streak] skipped: not logged in");
      return null;
    }

    const today = new Date();
    const todayStr = toDateString(today);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    saveReadDay(user.id, todayStr);

    const { data: profile, error } = await supabase.from("profiles").select("current_streak, longest_streak, last_devotional_date").eq("id", user.id).single();
    if (error) throw error;

    if (profile.last_devotional_date === todayStr) {
      console.log("[streak] already recorded today", profile);
      return profile;
    }

    const next = profile.last_devotional_date === toDateString(yesterday) ? (profile.current_streak ?? 0) + 1 : 1;

    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({ current_streak: next, longest_streak: Math.max(profile.longest_streak ?? 0, next), last_devotional_date: todayStr, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .or(`last_devotional_date.is.null,last_devotional_date.neq.${todayStr}`)
      .select("current_streak, longest_streak, last_devotional_date")
      .maybeSingle();
    if (updateError) throw updateError;

    if (!data) console.warn("[streak] update changed 0 rows. Likely a Row Level Security policy blocking updates on profiles.");
    else console.log("[streak] recorded", data);

    return data;
  } catch (err) {
    console.error("[streak] failed:", err);
    return null;
  } finally {
    window.dispatchEvent(new Event(STREAK_EVENT));
  }
}