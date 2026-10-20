import { supabase } from "./supabaseClient";

function redirectUrl(path) {
  const origin = window.location.origin;
  return typeof path === "string" && path.startsWith("/") && !path.startsWith("//") ? origin + path : origin;
}

export async function signInWithMagicLink(email, redirectPath) {
  const { error } = await supabase.auth.signInWithOtp({ email: String(email).trim().toLowerCase(), options: { emailRedirectTo: redirectUrl(redirectPath), shouldCreateUser: true } });
  if (error) {
    console.error("Error sending magic link:", error);
    throw error;
  }
}

export async function signInWithGoogleIdToken(idToken) {
  if (!idToken) throw new Error("Missing Google credential.");
  const { data, error } = await supabase.auth.signInWithIdToken({ provider: "google", token: idToken });
  if (error) {
    console.error("Error signing in with Google ID token:", error);
    throw error;
  }
  return data;
}