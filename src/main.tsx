import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { init, miniApp } from "@telegram-apps/sdk";
import { isTMA } from "@telegram-apps/bridge";
import "./index.css";

const initializeTelegramSDK = async () => {
  if (await !isTMA("complete")) {
    console.warn("Приложение запущено не в Telegram Mini App");
    return;
  }

  try {
    await init();

    if (miniApp.ready.ifAvailable()) {
      await miniApp.ready();
      console.log("MiniApp готово к использованию");
    }
  } catch (error) {
    console.error("Ошибка инициализации SDK Telegram", error);
  }
};

// Проверяем URL-параметр debug
const urlParams = new URLSearchParams(window.location.search);
const shouldEnableDebug = urlParams.get("debug") === "true";

if (shouldEnableDebug) {
  import("eruda").then((eruda) => {
    eruda.default.init();
    console.log("Eruda initialized");
  });
}

initializeTelegramSDK();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
