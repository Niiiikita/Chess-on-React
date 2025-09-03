import { useEffect } from "react";

export function ErudaInitializer() {
  useEffect(() => {
    // Вариант A: только в dev
    if (import.meta.env.DEV) {
      import("eruda").then((eruda) => {
        eruda.default.init();
      });
    }

    // Вариант B: только при ?debug в URL
    const params = new URLSearchParams(window.location.search);
    if (params.get("debug") === "true") {
      import("eruda").then((eruda) => {
        eruda.default.init();
      });
    }
  }, []);

  return null; // Ничего не рендерим
}
