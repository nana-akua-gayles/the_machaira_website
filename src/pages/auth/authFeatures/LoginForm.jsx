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

      <h2 className="text-center text-2xl font-semibold text-navy-dark">
        Welcome to Machaira
      </h2>

      <p className="mt-1 text-center text-sm text-cool-gray">
        Sign in to continue your journey with us.
      </p>

      {authError && (
        <p className="mt-6 rounded-lg bg-[#FBEAEA] px-4 py-3 text-sm text-burgundy-primary">
          {authError}
        </p>
      )}

      <div className="mt-8">
        <GoogleSignInButton onError={setAuthError} />
      </div>


    <div className="mt-3 grid grid-cols-2 gap-3">
      {/* Facebook */}
      <button
        type="button"
        onClick={() => handleSocialLogin("facebook")}
        className="
          group flex items-center justify-center gap-2
          rounded-full border border-black/10
          bg-white py-2.5 text-sm font-medium
          text-navy-dark
          transition-all duration-300 ease-in-out
          hover:border-[#1877F2]
          hover:bg-[#1877F2]
          hover:text-white
          hover:shadow-[0_6px_20px_rgba(24,119,242,0.20)]
          active:scale-[0.98]
        "
      >
        <FacebookIcon />
        <span className="transition-colors duration-300">
          Facebook
        </span>
      </button>

      {/* Apple */}
      <button
        type="button"
        onClick={() => handleSocialLogin("apple")}
        className="
          group flex items-center justify-center gap-2
          rounded-full border border-black/10
          bg-white py-2.5 text-sm font-medium
          text-navy-dark
          transition-all duration-300 ease-in-out
          hover:border-black
          hover:bg-black
          hover:text-white
          hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)]
          active:scale-[0.98]
        "
      >
        <AppleIcon />
        <span className="transition-colors duration-300">
          Apple
        </span>
      </button>
    </div>


    </div>
  );
}

export default LoginForm;