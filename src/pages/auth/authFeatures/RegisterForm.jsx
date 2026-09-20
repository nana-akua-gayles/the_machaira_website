import { useState } from "react";

import {
  UserIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  GoogleIcon,
  FacebookIcon,
  AppleIcon,
} from "./authIcons";
import churchLogo from "../../../assets/images/MLogo.png";
import { useNavigate } from "react-router-dom";
import { signUpWithPassword } from "../../../lib/authService";

function RegisterForm({ onSwitchToLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError("Passwords don't match. Please check and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await signUpWithPassword(email, password, fullName);

      if (data.session) {
        // Confirm email is off — they're genuinely logged in already.
        navigate("/");
      } else {
        // Confirm email is on — account created, but not signed in yet.
        setConfirmationSent(true);
      }
    } catch (err) {
      setFormError(
        err?.message ||
          "We couldn't create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSocialSignup(provider) {
    // TODO: wire up supabase.auth.signInWithOAuth({ provider }) for
    // whichever providers are confirmed configured in Supabase.
    console.log(`${provider} sign-up clicked (not yet wired)`);
  }

    if (confirmationSent) {
    return (
      <div className="w-full max-w-[420px] text-center">
        <h2 className="mt-10 text-2xl font-semibold text-[#101A2B] lg:mt-0">
          Check Your Email
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#4D5057]">
          We've sent a confirmation link to <strong>{email}</strong>. Click
          it to activate your account, then come back and log in.
        </p>

        <button
          type="button"
          onClick={onSwitchToLogin}
          className="mt-6 inline-flex items-center justify-center rounded-full border border-[#991313] px-6 py-2.5 text-sm font-semibold text-[#991313] transition-colors hover:bg-[#991313] hover:text-white"
        >
          Back to Login
        </button>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-[420px]">

      <img
        src={churchLogo}
        alt="Church logo"
        className="mx-auto -mb-24 block h-80 w-80 object-contain"
      />

      <h2 className="mt-10 text-center text-2xl font-semibold text-[#101A2B] lg:mt-0">
        Create Your Account
      </h2>

      <p className="mt-1 text-center text-sm text-[#4D5057]">
        Join Machaira and begin your journey with us.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#101A2B]">
            Full Name
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <UserIcon />
            </span>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-full border border-black/10 bg-[#F8F8F7] py-3 pl-11 pr-4 text-sm text-[#101A2B] placeholder:text-[#B9BEC8] focus:border-[#991313] focus:outline-none"
            />
          </div>
        </div>

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
              placeholder="Create a password"
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#101A2B]">
            Confirm Password
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <LockIcon />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full rounded-full border border-black/10 bg-[#F8F8F7] py-3 pl-11 pr-4 text-sm text-[#101A2B] placeholder:text-[#B9BEC8] focus:border-[#991313] focus:outline-none"
            />
          </div>
        </div>

        {formError && (
          <p className="rounded-lg bg-[#FBEAEA] px-4 py-3 text-sm text-[#991313]">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#991313] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7f0e0e] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
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
          onClick={() => handleSocialSignup("google")}
          className="flex items-center justify-center gap-2 rounded-full border border-black/10 py-2.5 text-sm font-medium text-[#101A2B] transition-colors hover:bg-[#F8F8F7]"
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          onClick={() => handleSocialSignup("facebook")}
          className="flex items-center justify-center gap-2 rounded-full border border-black/10 py-2.5 text-sm font-medium text-[#101A2B] transition-colors hover:bg-[#F8F8F7]"
        >
          <FacebookIcon />
          Facebook
        </button>
        <button
          type="button"
          onClick={() => handleSocialSignup("apple")}
          className="flex items-center justify-center gap-2 rounded-full border border-black/10 py-2.5 text-sm font-medium text-[#101A2B] transition-colors hover:bg-[#F8F8F7]"
        >
          <AppleIcon />
          Apple
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-[#F8F8F7] p-5 text-center">
        <p className="text-sm text-[#4D5057]">
          Already have an account?
        </p>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="mt-3 inline-flex items-center justify-center rounded-full border border-[#991313] px-6 py-2.5 text-sm font-semibold text-[#991313] transition-colors hover:bg-[#991313] hover:text-white"
        >
          Log In Instead
        </button>
      </div>

    </div>
  );
}

export default RegisterForm;