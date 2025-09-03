import { useEffect, useState } from "react";
import { init } from "@telegram-apps/sdk";
// import { isTMA } from "@telegram-apps/bridge";

export function useTelegram() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tg, setTg] = useState<any>(null);

  useEffect(() => {
    // Проверяем, есть ли window.Telegram
    if (typeof window === "undefined" || !window.Telegram) {
      console.warn("Приложение запущено не в Telegram Mini App");
      return;
    }

    // Инициализируем SDK только если Telegram существует
    try {
      init();
    } catch (e) {
      console.warn("SDK не может быть инициализирован — не в Telegram", e);
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
