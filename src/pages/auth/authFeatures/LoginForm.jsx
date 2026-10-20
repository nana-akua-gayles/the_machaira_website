import { useEffect, useRef, useState } from "react";
import { MailIcon } from "lucide-react";
import { signInWithMagicLink } from "../../../lib/authService";
import GoogleSignInButton from "./GoogleSignInButton";

const RESEND_SECONDS = 60;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function toMessage(err) {
  const msg = String(err?.message || err || "");
  if (err?.status === 429 || /rate|too many|security purposes/i.test(msg)) return "Too many attempts. Please wait a minute and try again.";
  if (/network|fetch|offline/i.test(msg)) return "Network problem. Check your connection and try again.";
  return "We couldn't send the link. Please try again.";
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const busy = useRef(false);
  const value = email.trim().toLowerCase();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function send() {
    if (busy.current) return;
    busy.current = true;
    setError("");
    setSending(true);
    try {
      await signInWithMagicLink(value);
      setSent(true);
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(toMessage(err));
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!EMAIL_RE.test(value)) return setError("Please enter a valid email address.");
    send();
  }

  function handleGoogleError(e) {
    setError(typeof e === "string" ? e : e?.message || "Google sign-in failed. Please try again.");
  }

  function reset() {
    setSent(false);
    setEmail("");
    setError("");
    setCooldown(0);
  }

  if (sent) {
    return (
      <div className="auth-pop rounded-2xl border border-slate-200 bg-white/70 p-5 text-center shadow-lg" role="status" aria-live="polite">
        <div className="relative mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-burgundy-primary/10 text-burgundy-primary">
          <span className="auth-ring absolute inset-0 rounded-full border border-burgundy-primary/40" />
          <MailIcon className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">Check your inbox</h2>
        <p className="mt-1 text-sm text-slate-600">We sent a sign-in link to <span className="break-all font-medium text-slate-900">{value}</span>. Tap it to continue.</p>
        <p className="mt-2 text-xs text-slate-400">Nothing yet? Check your spam folder.</p>
        {error && <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium">
          <button type="button" onClick={send} disabled={sending || cooldown > 0} className="rounded text-burgundy-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-primary/40 disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline">
            {sending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend link"}
          </button>
          <span className="h-3 w-px bg-slate-300" aria-hidden="true" />
          <button type="button" onClick={reset} className="rounded text-slate-500 hover:text-slate-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-primary/40">Use a different email</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GoogleSignInButton onError={handleGoogleError} />

      <div className="flex items-center gap-3 text-xs font-medium text-slate-400" role="separator" aria-label="or">
        <span className="h-px flex-1 bg-slate-300/70" />
        or
        <span className="h-px flex-1 bg-slate-300/70" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-600">Email address</label>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="send" maxLength={254} value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }} placeholder="you@example.com" disabled={sending} aria-invalid={!!error} aria-describedby={error ? "login-error" : undefined} className="h-12 w-full rounded-full border border-slate-300 bg-white/70 px-5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-burgundy-primary focus:bg-white focus:ring-4 focus:ring-burgundy-primary/15 disabled:opacity-60 sm:text-sm" />
        </div>
        <button type="submit" disabled={sending || !value} className="relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-burgundy-primary px-4 text-sm font-semibold text-white shadow-lg shadow-burgundy-primary/40 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-burgundy-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-burgundy-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">
          {!sending && <span className="auth-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30" aria-hidden="true" />}
          {sending && <span className="auth-spin-fast h-4 w-4 rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
          <span className="relative">{sending ? "Sending link..." : "Email me a magic link"}</span>
        </button>
      </form>

      {error && <p id="login-error" role="alert" className="auth-pop rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-xs text-red-600">{error}</p>}

      <p className="text-center text-[11px] leading-relaxed text-slate-400">No password needed. New here? Signing in creates your account automatically.</p>
    </div>
  );
}

export default LoginForm;