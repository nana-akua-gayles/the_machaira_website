import { useEffect, useState } from "react";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

const isReady = () => typeof window !== "undefined" && !!window.google?.accounts?.id;

export function useGoogleIdentityScript() {
  const [loaded, setLoaded] = useState(isReady);

  useEffect(() => {
    if (loaded) return;
    if (isReady()) return setLoaded(true);
    let script = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
    const onLoad = () => setLoaded(isReady());
    const onError = () => script.remove();
    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
    return () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };
  }, [loaded]);

  return loaded;
}