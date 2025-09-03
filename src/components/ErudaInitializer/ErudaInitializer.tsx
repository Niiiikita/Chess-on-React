import { useEffect } from "react";

export function ErudaInitializer() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldEnableDebug = params.get("debug") === "true";

    console.log("ErudaInitializer: debug mode =", shouldEnableDebug); // 🔍 Лог

    if (shouldEnableDebug) {
      console.log("Попытка загрузить Eruda..."); // 🔍 Лог
      import("eruda")
        .then((eruda) => {
          console.log("Eruda загружена", eruda); // 🔍 Лог
          if (!window.eruda) {
            eruda.default.init();
            if (typeof window === "undefined" || !window.Telegram) {
              console.warn("Приложение запущено не в Telegram Mini App");
              return;
            }
          }
        })
        .catch((err) => {
          console.error("Ошибка загрузки Eruda", err); // 🔍 Лог
        });
    }
  }, []);

  return null;
}
