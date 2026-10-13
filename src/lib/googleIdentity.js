import { useEffect, useState } from "react";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export function useGoogleIdentityScript() {
  const [loaded, setLoaded] = useState(typeof window !== "undefined" && !!window.google?.accounts?.id);

  useEffect(() => {
    if (loaded) return;
    const onLoad = () => setLoaded(true);
    let script = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", onLoad);
    return () => script.removeEventListener("load", onLoad);
  }, [loaded]);

  return loaded;
}