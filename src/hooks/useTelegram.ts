import { useEffect, useState } from "react";
import { init } from "@telegram-apps/sdk";

export function useTelegram() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tg, setTg] = useState<any>(null);

  useEffect(() => {
    // Проверяем, в Telegram ли мы
    if (typeof window === "undefined" || !window.Telegram) {
      console.warn("Приложение запущено не в Telegram Mini App");
      return;
    }

    // Инициализируем SDK
    try {
      init();
    } catch (e) {
      console.warn("SDK не может быть инициализирован", e);
      return;
    }

    // Ждём появления WebApp
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
