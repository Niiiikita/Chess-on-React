import { Settings } from "@/utils/typeBoard/types";
import { useState, useEffect } from "react";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("chess-settings");
    return saved
      ? JSON.parse(saved)
      : {
          theme: "dark",
          highlightMoves: true,
          animations: false,
          sound: false,
          fullscreen: false,
        };
  });

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("chess-settings", JSON.stringify(settings));
    document.documentElement.className = settings.theme; // добавляем класс к <html>
  }, [settings]);

  return { settings, setSettings };
}
