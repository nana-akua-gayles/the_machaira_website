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
          if (!credential) {
            throw new Error("Google did not return a credential.");
          }

          await signInWithGoogleIdToken(credential);
          navigate("/", { replace: true });
        } catch (err) {
          onErrorRef.current?.(
            err?.message || "Google sign-in failed."
          );
        }
      },
    });

    buttonRef.current.replaceChildren();

    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "continue_with",
      logo_alignment: "left",
      width: 380,
    });
  }, [scriptLoaded, navigate]);

  return (
    <div className="flex w-full justify-center">
      <div ref={buttonRef} />
    </div>
  );
}

export default GoogleSignInButton;