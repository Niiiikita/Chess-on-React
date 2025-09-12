import { GameModeType } from "../typeBoard/types";

/**
 * Извлекает режим из параметров строки запроса URL.
 * @returns режим, извлеченный из URL, который может быть "menu", "local" или "vs-ai".
 */
export function getModeFromUrl(): GameModeType {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");

  if (mode === "local" || mode === "vs-ai") {
    return mode;
  }

  if (mode === "online" || mode === "online-create") {
    return mode;
  }

  if (mode?.startsWith("online-join-")) {
    return mode as `online-join-${string}`;
  }

  return "menu";
}
