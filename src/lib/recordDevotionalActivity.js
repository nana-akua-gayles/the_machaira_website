import { supabase } from "./supabaseClient";

const toDateString = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export async function recordDevotionalActivity() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const today = new Date();
    const todayStr = toDateString(today);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const { data: profile, error } = await supabase.from("profiles").select("current_streak, longest_streak, last_devotional_date").eq("id", user.id).single();
    if (error) throw error;
    if (profile.last_devotional_date === todayStr) return profile;

    const next = profile.last_devotional_date === toDateString(yesterday) ? (profile.current_streak ?? 0) + 1 : 1;

    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({ current_streak: next, longest_streak: Math.max(profile.longest_streak ?? 0, next), last_devotional_date: todayStr, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .or(`last_devotional_date.is.null,last_devotional_date.neq.${todayStr}`)
      .select("current_streak, longest_streak, last_devotional_date")
      .maybeSingle();
    if (updateError) throw updateError;
    return data;
  } catch (err) {
    console.error("Error recording devotional activity:", err);
    return null;
  }
}