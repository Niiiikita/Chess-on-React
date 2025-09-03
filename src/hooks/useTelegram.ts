import { useEffect, useState } from "react";
import { init } from "@telegram-apps/sdk";
import { isTMA } from "@telegram-apps/bridge";

export function useTelegram() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tg, setTg] = useState<any>(null);

  useEffect(() => {
    // Проверяем, запущено ли приложение в Telegram Mini App
    if (!isTMA()) {
      console.warn("Приложение запущено не в Telegram Mini App");
      return;
    }

    // Инициализируем SDK только в Telegram
    init();

    const timer = setInterval(() => {
      if (window.Telegram?.WebApp) {
        clearInterval(timer);
        setTg(window.Telegram.WebApp);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(timer);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, []);

  return tg;
}
