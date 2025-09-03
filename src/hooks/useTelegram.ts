/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { init } from "@telegram-apps/sdk";
import { isTMA } from "@telegram-apps/bridge";

export function useTelegram() {
  const [tg, setTg] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (await isTMA("complete")) {
        console.log("It's Telegram Mini Apps");
      }
    })();

    // Инициализируем SDK
    try {
      init();
    } catch (e) {
      console.warn("SDK не может быть инициализирован", e);
      return;
    }

    // Ждём появления WebApp
    const timer = setInterval(() => {
      if (window.Telegram?.WebView) {
        clearInterval(timer);
        setTg(window.Telegram?.WebView);
      }
    }, 100);
  }, []);

  return tg;
}
