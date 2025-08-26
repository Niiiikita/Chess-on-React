// Получаем текущий режим из URL
/**
 * Извлекает режим из параметров строки запроса URL.
 * @returns режим, извлеченный из URL, который может быть "menu", "local" или "vs-ai".
 */
export function getModeFromUrl(): "menu" | "local" | "vs-ai" | "online" {
  // Создаем объект URLSearchParams из текущего URL
  const params = new URLSearchParams(window.location.search);
  // Извлекаем параметр "mode"
  const mode = params.get("mode");
  // Возвращаем режим или "menu", если режим не указан
  if (mode === "local" || mode === "vs-ai") {
    return mode;
  }
  return "menu";
}
