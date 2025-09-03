import { useEffect, useState } from "react";
import { init } from "@telegram-apps/sdk";

export function useTelegram() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tg, setTg] = useState<any>(null);

  useEffect(() => {
    // Инициализируем SDK
    init();

    // Проверяем каждые 100мс, появился ли Telegram.WebApp
    const timer = setInterval(() => {
      if (window.Telegram?.WebApp) {
        clearInterval(timer);
        setTg(window.Telegram.WebApp);
      }
    }, 100);

    // Таймаут на 5 секунд
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
