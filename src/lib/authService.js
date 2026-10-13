import { supabase } from "./supabaseClient";

export async function signInWithOAuth(provider) {
  const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } });
  if (error) {
    console.error(`Error starting ${provider} sign-in:`, error);
    throw error;
  }
}

export async function signInWithMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
  if (error) {
    console.error("Error sending magic link:", error);
    throw error;
  }
}

export async function signInWithGoogleIdToken(idToken) {
  const { data, error } = await supabase.auth.signInWithIdToken({ provider: "google", token: idToken });
  if (error) {
    console.error("Error signing in with Google ID token:", error);
    throw error;
  }
  return data;
}