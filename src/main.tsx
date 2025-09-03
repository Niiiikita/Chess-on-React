import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
// import { ErudaInitializer } from "./components/ErudaInitializer/ErudaInitializer";

// Проверяем URL-параметр debug
const urlParams = new URLSearchParams(window.location.search);
const shouldEnableDebug = urlParams.get("debug") === "true";

if (shouldEnableDebug) {
  import("eruda").then((eruda) => {
    eruda.default.init();
    console.log("Eruda initialized");
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
