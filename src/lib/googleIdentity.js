import { useEffect, useState } from "react";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export function useGoogleIdentityScript() {
  const [loaded, setLoaded] = useState(
    typeof window !== "undefined" && !!window.google?.accounts?.id
  );

  useEffect(() => {
    if (loaded) return;

    const existing = document.querySelector(
      `script[src="${GOOGLE_SCRIPT_SRC}"]`
    );

    if (existing) {
      existing.addEventListener("load", () => setLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, [loaded]);

  return loaded;
}