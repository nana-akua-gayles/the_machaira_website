import { useEffect, useRef, useState } from "react";
import { useGoogleIdentityScript } from "../../../lib/googleIdentity";
import { signInWithGoogleIdToken } from "../../../lib/authService";

const GOOGLE_CLIENT_ID = import.meta.env.GOOGLE_CLIENT_ID;
const UNAVAILABLE = "Google sign-in is unavailable right now. Please use email instead.";
const FAILED = "Google sign-in failed. Please try again.";

function GoogleSignInButton({ onError }) {
  const scriptLoaded = useGoogleIdentityScript();
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const onErrorRef = useRef(onError);
  const alive = useRef(true);
  const [width, setWidth] = useState(0);
  const [signingIn, setSigningIn] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(Math.round(el.clientWidth));
    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (scriptLoaded) return;
    const t = setTimeout(() => { setFailed(true); onErrorRef.current?.(UNAVAILABLE); }, 8000);
    return () => clearTimeout(t);
  }, [scriptLoaded]);

  useEffect(() => {
    if (!scriptLoaded) return;
    if (!GOOGLE_CLIENT_ID || !window.google?.accounts?.id) {
      console.error("Google sign-in unavailable: missing GOOGLE_CLIENT_ID or Google script.");
      setFailed(true);
      onErrorRef.current?.(UNAVAILABLE);
      return;
    }
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      ux_mode: "popup",
      callback: async ({ credential }) => {
        if (!credential) return onErrorRef.current?.(FAILED);
        onErrorRef.current?.("");
        setSigningIn(true);
        try {
          await signInWithGoogleIdToken(credential);
        } catch (err) {
          console.error(err);
          onErrorRef.current?.(FAILED);
          if (alive.current) setSigningIn(false);
        }
      },
    });
  }, [scriptLoaded]);

  useEffect(() => {
    if (!scriptLoaded || !width || !GOOGLE_CLIENT_ID || !window.google?.accounts?.id || !buttonRef.current) return;
    buttonRef.current.replaceChildren();
    window.google.accounts.id.renderButton(buttonRef.current, { type: "standard", theme: "outline", size: "large", shape: "pill", text: "continue_with", logo_alignment: "left", width: Math.min(400, Math.max(200, width)) });
    const t = setTimeout(() => {
      if (buttonRef.current?.childElementCount === 0) {
        console.warn("Google button did not render. Check that this origin is listed under Authorized JavaScript origins in Google Cloud.");
        setFailed(true);
        onErrorRef.current?.(UNAVAILABLE);
      }
    }, 4000);
    return () => clearTimeout(t);
  }, [scriptLoaded, width]);

  if (failed) return null;

  return (
    <div ref={containerRef} className="relative flex min-h-[44px] w-full items-center justify-center" aria-busy={signingIn}>
      {!scriptLoaded && <div className="absolute inset-0 animate-pulse rounded-full border border-slate-300 bg-white/70" />}
      <div ref={buttonRef} className="relative" />
      {signingIn && (
        <div role="status" className="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/90 text-sm font-medium text-slate-600">
          <span className="auth-spin-fast h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-600" aria-hidden="true" />
          Signing in...
        </div>
      )}
    </div>
  );
}

export default GoogleSignInButton;