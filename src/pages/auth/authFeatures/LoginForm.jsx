import { useState } from "react";

import churchLogo from "../../../assets/images/MLogo.png";
import { signInWithOAuth } from "../../../lib/authService";
import { FacebookIcon, AppleIcon } from "./authIcons";
import GoogleSignInButton from "./GoogleSignInButton";

function LoginForm() {
  const [authError, setAuthError] = useState(null);

  async function handleSocialLogin(provider) {
    try {
      await signInWithOAuth(provider);
    } catch (err) {
      setAuthError(
        err?.message || `We couldn't start ${provider} sign-in. Please try again.`
      );
    }
  }

  return (
    <div className="w-full max-w-[420px]">

      <img
        src={churchLogo}
        alt="Church logo"
        className="mx-auto -mb-24 block h-80 w-80 object-contain"
      />

      <h2 className="text-center text-2xl font-semibold text-[#101A2B]">
        Welcome to Machaira
      </h2>

      <p className="mt-1 text-center text-sm text-[#4D5057]">
        Sign in to continue your journey with us.
      </p>

      {authError && (
        <p className="mt-6 rounded-lg bg-[#FBEAEA] px-4 py-3 text-sm text-[#991313]">
          {authError}
        </p>
      )}

      <div className="mt-8">
        <GoogleSignInButton onError={setAuthError} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocialLogin("facebook")}
          className="flex items-center justify-center gap-2 rounded-full border border-black/10 py-2.5 text-sm font-medium text-[#101A2B] transition-colors hover:bg-[#F8F8F7]"
        >
          <FacebookIcon />
          Facebook
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("apple")}
          className="flex items-center justify-center gap-2 rounded-full border border-black/10 py-2.5 text-sm font-medium text-[#101A2B] transition-colors hover:bg-[#F8F8F7]"
        >
          <AppleIcon />
          Apple
        </button>
      </div>

    </div>
  );
}

export default LoginForm;