import { useEffect, useState } from "react";
import { init } from "@telegram-apps/sdk";

export function useTelegram() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tg, setTg] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.Telegram?.WebApp) {
        clearInterval(timer);
        init();
        setTg(window.Telegram.WebApp);
      }
    }, 100);

    // Таймаут на 3 секунды — если не загрузилось
    const timeout = setTimeout(() => {
      clearInterval(timer);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, []);

  return tg;
}
