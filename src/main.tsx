import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import initializeTelegramSDK from "./telegramSettings/miniapp/initializeTelegramSDK";
import "./index.css";

// Запускаем инициализацию
initializeTelegramSDK();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
