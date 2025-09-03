import { useEffect } from "react";

export function ErudaInitializer() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldEnableDebug = params.get("debug") === "true";

    if (shouldEnableDebug) {
      // Динамический импорт — Vite включит eruda в отдельный чанк
      import("eruda").then((eruda) => {
        if (!window.eruda) {
          eruda.default.init();
        }
      });
    }
  }, []);

  return null;
}
