import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useGoogleIdentityScript } from "../../../lib/googleIdentity";
import { signInWithGoogleIdToken } from "../../../lib/authService";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function GoogleSignInButton({ onError }) {
  const navigate = useNavigate();
  const scriptLoaded = useGoogleIdentityScript();
  const buttonRef = useRef(null);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!scriptLoaded || !buttonRef.current) return;

    if (!GOOGLE_CLIENT_ID) {
      onErrorRef.current?.("Google Client ID is missing.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      ux_mode: "popup",
      callback: async ({ credential }) => {
        try {
          if (!credential) throw new Error("Google did not return a credential.");
          await signInWithGoogleIdToken(credential);
          navigate("/", { replace: true });
        } catch (err) {
          onErrorRef.current?.(err?.message || "Google sign-in failed.");
        }
      },
    });

    const width = Math.min(400, Math.max(200, Math.floor(buttonRef.current.parentElement.clientWidth)));
    buttonRef.current.replaceChildren();
    window.google.accounts.id.renderButton(buttonRef.current, { type: "standard", theme: "outline", size: "large", shape: "pill", text: "continue_with", logo_alignment: "left", width });

    const check = setTimeout(() => {
      if (buttonRef.current && buttonRef.current.childElementCount === 0) onErrorRef.current?.("Google sign-in couldn't load. Check that this site's address is allowed in Google Cloud.");
    }, 2000);
    return () => clearTimeout(check);
  }, [scriptLoaded, navigate]);

  return (
    <div className="relative flex min-h-[44px] w-full items-center justify-center">
      {!scriptLoaded && <div className="absolute inset-0 animate-pulse rounded-full border border-slate-300 bg-white/70" />}
      <div ref={buttonRef} className="relative" />
    </div>
  );
}

export default GoogleSignInButton;