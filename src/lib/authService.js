import { supabase } from "./supabaseClient";

/**
 * Sign in an existing user with email + password.
 */
export async function signInWithPassword(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("signInWithPassword failed:", error);
    throw error;
  }
}

/**
 * Create a new account with email + password, storing the full name
 * as user metadata.
 */
export async function signUpWithPassword(email, password, fullName) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      console.error("Error signing up:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("signUpWithPassword failed:", error);
    throw error;
  }
}

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