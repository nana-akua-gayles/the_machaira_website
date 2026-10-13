import { useState } from "react";
import { signInWithMagicLink } from "../../../lib/authService";
import { MailIcon } from "./authIcons";
import GoogleSignInButton from "./GoogleSignInButton";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const sending = status === "sending";

  async function handleSubmit(e) {
    e.preventDefault();
    const value = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) return setError("Please enter a valid email address.");
    setError("");
    setStatus("sending");
    try {
      await signInWithMagicLink(value);
      setStatus("sent");
    } catch (err) {
      setError(err?.message || "We couldn't send the link. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="auth-pop rounded-2xl border border-slate-200 bg-white/70 p-5 text-center shadow-lg">
        <div className="relative mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-burgundy-primary/10 text-burgundy-primary">
          <span className="auth-ring absolute inset-0 rounded-full border border-burgundy-primary/40" />
          <MailIcon />
        </div>
        <h2 className="text-base font-semibold text-slate-900">Check your inbox</h2>
        <p className="mt-1 text-sm text-slate-600">
          We sent a sign-in link to <span className="font-medium text-slate-900">{email.trim()}</span>. Tap it to continue.
        </p>
        <button type="button" onClick={() => { setStatus("idle"); setEmail(""); }} className="mt-4 text-xs font-medium text-burgundy-primary hover:underline">
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GoogleSignInButton onError={setError} />

      <div className="auth-rise flex items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-slate-400" style={{ "--d": ".8s" }}>
        <span className="h-px flex-1 bg-slate-300/70" />
        or
        <span className="h-px flex-1 bg-slate-300/70" />
      </div>

      <form onSubmit={handleSubmit} className="auth-rise space-y-3" style={{ "--d": ".9s" }}>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-600">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={sending}
            className="w-full rounded-full border border-slate-300 bg-white/70 px-5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-burgundy-primary focus:bg-white focus:ring-4 focus:ring-burgundy-primary/15 disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={sending || !email.trim()}
          className="relative w-full overflow-hidden rounded-full bg-burgundy-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-burgundy-primary/40 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-burgundy-primary/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="auth-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30" />
          <span className="relative">{sending ? "Sending link..." : "Email me a magic link"}</span>
        </button>
      </form>

      {error && <p role="alert" className="auth-pop rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-xs text-red-600">{error}</p>}

      <p className="auth-rise text-center text-[11px] leading-relaxed text-slate-400" style={{ "--d": "1s" }}>
        No password needed. New here? Signing in creates your account automatically.
      </p>
    </div>
  );
}

export default LoginForm;