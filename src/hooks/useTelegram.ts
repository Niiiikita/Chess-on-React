/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { init, isTMA } from "@telegram-apps/sdk";

export function useTelegram() {
  const [tg, setTg] = useState<any>(null);

  useEffect(() => {
    if (!isTMA()) {
      console.warn("Приложение запущено не в Telegram Mini App");
      return;
    }

    try {
      init();
    } catch (e) {
      console.warn("SDK не может быть инициализирован", e);
      return;
    }

    const timer = setInterval(() => {
      if (window.Telegram?.WebApp) {
        clearInterval(timer);
        setTg(window.Telegram.WebApp);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return tg;
}
