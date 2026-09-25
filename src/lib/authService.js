import { supabase } from "./supabaseClient";

/**
 * Start an OAuth sign-in/sign-up flow for the given provider (e.g.
 * "google", "facebook", "apple"). Supabase redirects the browser to
 * the provider, then back to `redirectTo` once approved, at which
 * point Supabase completes the session automatically. Works
 * identically from the login or register screen — Supabase creates
 * the account on first use if one doesn't already exist.
 */
export async function signInWithOAuth(provider) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: "http://localhost:5173"
    },
  });

  if (error) {
    console.error(`Error starting ${provider} sign-in:`, error);
    throw error;
  }
}

/**
 * Sign in with a Google ID token obtained directly in the browser
 * via Google Identity Services — no redirect through Supabase at
 * all, avoiding the OAuth redirect flow entirely.
 */
export async function signInWithGoogleIdToken(idToken) {
  try {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
    });

    if (error) {
      console.error("Error signing in with Google ID token:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("signInWithGoogleIdToken failed:", error);
    throw error;
  }
}