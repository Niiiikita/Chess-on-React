/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { init } from "@telegram-apps/sdk";

export function useTelegram() {
  const [tg, setTg] = useState<any>(null);

  try {
    init();
  } catch (e) {
    console.warn("SDK не может быть инициализирован", e);
    return;
  }

  const timer = setInterval(() => {
    if (window.Telegram?.WebApp) {
      clearInterval(timer);
      console.log("Telegram WebApp наконе-то запущен");
      setTg(window.Telegram.WebApp);
    }
  }, 100);

  return tg;
}
