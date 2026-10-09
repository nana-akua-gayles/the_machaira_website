import { useState } from "react";

import { signInWithOAuth } from "../../../lib/authService";
import { GoogleIcon } from "./authIcons";

function GoogleSignInButton({ onError }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleLogin() {
    if (isLoading) return;

    setIsLoading(true);
    onError?.(null);

    try {
      await signInWithOAuth("google");
    } catch (err) {
      onError?.(
        err?.message || "We couldn't sign you in with Google."
      );
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="
        group flex w-full items-center justify-center gap-3
        rounded-full border border-black/10
        bg-white px-5 py-3
        text-sm font-medium text-[#101A2B]
        transition-all duration-300 ease-in-out

        hover:border-[#4285F4]
        hover:bg-[#4285F4]
        hover:text-white
        hover:shadow-[0_6px_20px_rgba(66,133,244,0.22)]

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#4285F4]
        focus-visible:ring-offset-2

        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white p-0.5">
        <GoogleIcon />
      </span>

      <span>
        {isLoading ? "Connecting to Google..." : "Continue with Google"}
      </span>
    </button>
  );
}

export default GoogleSignInButton;