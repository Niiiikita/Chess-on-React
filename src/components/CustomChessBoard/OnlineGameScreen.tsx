import { useEffect, useState } from "react";
import Board from "../Board/Board";
import type { GameModeType } from "@/utils/typeBoard/types";
import { getModeFromUrl } from "@/utils/modeUrl/getModeFromUrl";
import { setModeInUrl } from "@/utils/modeUrl/setModeInUrl";

export function OnlineGameScreen({
  initialMode,
  onExitToMenu,
}: {
  initialMode: GameModeType;
  onExitToMenu: () => void;
}) {
  const [gameState, setGameState] = useState<GameModeType>(initialMode);

  // При старте — синхронизируем с URL
  useEffect(() => {
    const mode = getModeFromUrl();
    if (mode !== "menu") {
      setGameState(mode);
    }
  }, []);

  // При изменении gameState — обновляем URL
  useEffect(() => {
    setModeInUrl(gameState);
  }, [gameState]);

  // Если gameState стал "menu" — выходим
  useEffect(() => {
    if (gameState === "menu") {
      onExitToMenu(); // ← уведомляем App
    }
  }, [gameState, onExitToMenu]);

  return (
    <Board
      gameState={gameState}
      setGameState={setGameState}
    />
  );
}
