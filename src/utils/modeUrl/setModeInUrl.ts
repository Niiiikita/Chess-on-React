// Устанавливаем режим в URL

import { GameModeType } from "../typeBoard/types";

/**
 * Устанавливает режим в параметрах строки запроса URL.
 * @param mode - Режим, который нужно установить в URL. Может быть "menu", "local" или "vs-ai".
 * Если указано "menu", параметр "mode" удаляется из URL.
 * В противном случае параметр "mode" устанавливается в указанное значение.
 */
export function setModeInUrl(mode: GameModeType) {
  // Создаем объект URLSearchParams из текущего URL
  const params = new URLSearchParams(window.location.search);
  // Устанавливаем режим в параметры URL
  if (mode === "menu") {
    // Удаляем параметр "mode"
    params.delete("mode");
  } else {
    // Устанавливаем параметр "mode"
    params.set("mode", mode);
  }
  // Обновляем URL
  window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
}
