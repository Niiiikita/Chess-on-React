/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { init } from "@telegram-apps/sdk";

export function useTelegram() {
  const [tg, setTg] = useState<any>(null);

  useEffect(() => {
    // Инициализируем SDK
    try {
      init();
    } catch (e) {
      console.warn("SDK не может быть инициализирован", e);
      return;
    }

    // Ждём появления WebApp
    const timer = setInterval(() => {
      if (window.Telegram) {
        clearInterval(timer);
        setTg(window.Telegram);
      }
    }, 100);
  }, []);

  return tg;
}
