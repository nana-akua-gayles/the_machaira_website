import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signInWithPassword } from "../../../lib/authService";
import churchLogo from "../../../assets/images/MLogo.png"; // ← replace with your real image path
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  GoogleIcon,
  FacebookIcon,
  AppleIcon,
} from "./authIcons";

function LoginForm({ onSwitchToRegister }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    try {
      await signInWithPassword(email, password);
      navigate("/");
    } catch (err) {
      setAuthError(
        err?.message ||
          "We couldn't sign you in. Please check your details and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSocialLogin(provider) {
    // TODO: wire up supabase.auth.signInWithOAuth({ provider }) for
    // whichever providers are confirmed configured in Supabase.
    console.log(`${provider} login clicked (not yet wired)`);
  }

  return (
    <div className="w-full max-w-[420px]">

      <img
        src={churchLogo}
        alt="Church logo"
        className="mx-auto -mb-24 block h-80 w-80 object-contain"
      />

      <h2 className="text-center text-2xl font-semibold text-[#101A2B]">
        Login to Your Account
      </h2>

      <p className="mt-1 text-center text-sm text-[#4D5057]">
        We're glad to see you again!
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#101A2B]">
            Email Address
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <MailIcon />
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-full border border-black/10 bg-[#F8F8F7] py-3 pl-11 pr-4 text-sm text-[#101A2B] placeholder:text-[#B9BEC8] focus:border-[#991313] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#101A2B]">
            Password
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <LockIcon />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-full border border-black/10 bg-[#F8F8F7] py-3 pl-11 pr-11 text-sm text-[#101A2B] placeholder:text-[#B9BEC8] focus:border-[#991313] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-[#991313] transition-colors hover:text-[#7f0e0e]"
          >
            Forgot Password?
          </Link>
        </div>

        {authError && (
          <p className="rounded-lg bg-[#FBEAEA] px-4 py-3 text-sm text-[#991313]">
            {authError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#991313] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7f0e0e] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-black/10" />
        <span className="text-xs text-[#4D5057]">or continue with</span>
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          className="flex items-center justify-center gap-2 rounded-full border border-black/10 py-2.5 text-sm font-medium text-[#101A2B] transition-colors hover:bg-[#F8F8F7]"
        >
          <GoogleIcon />
          Google
        </button>
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

      <div className="mt-6 rounded-2xl bg-[#F8F8F7] p-5 text-center">
        <p className="text-sm text-[#4D5057]">
          New here? Join our community
        </p>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="mt-3 inline-flex items-center justify-center rounded-full border border-[#991313] px-6 py-2.5 text-sm font-semibold text-[#991313] transition-colors hover:bg-[#991313] hover:text-white"
        >
          Create an Account
        </button>
      </div>

    </div>
  );
}

export default LoginForm;