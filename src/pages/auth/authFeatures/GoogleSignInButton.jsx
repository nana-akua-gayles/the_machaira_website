import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useGoogleIdentityScript } from "../../../lib/googleIdentity";
import { signInWithGoogleIdToken } from "../../../lib/authService";

// Same Web Client ID you already entered in Supabase's Google
// provider settings — replace this with the real one.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function GoogleSignInButton({ onError }) {
  const navigate = useNavigate();
  const scriptLoaded = useGoogleIdentityScript();
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!scriptLoaded || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async ({ credential }) => {
        try {
          await signInWithGoogleIdToken(credential);
          navigate("/");
        } catch (err) {
          onError?.(err?.message || "We couldn't sign you in with Google.");
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      shape: "pill",
      width: 380,
    });
  }, [scriptLoaded, navigate, onError]);

  return <div ref={buttonRef} className="flex justify-center" />;
}

export default GoogleSignInButton;