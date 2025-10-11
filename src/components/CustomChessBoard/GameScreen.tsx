import { useEffect, useState } from "react";
import Board from "../Board/Board";
import { setModeInUrl } from "@/utils/modeUrl/setModeInUrl";
import { getModeFromUrl } from "@/utils/modeUrl/getModeFromUrl";
import type { GameModeType, LocalOrAiMode } from "@/utils/typeBoard/types";
import { useChessGame } from "@/hooks/useChessGame";

export function GameScreen({
  initialMode,
  onExitToMenu,
}: {
  initialMode: LocalOrAiMode;
  onExitToMenu: () => void;
}) {
  const [gameState, setGameState] = useState<GameModeType>(initialMode);
  const game = useChessGame();

  // При старте — синхронизируем с URL
  useEffect(() => {
    const mode = getModeFromUrl();
    if (mode !== "menu") {
      setGameState(mode);
    }
  }, []);

  // При изменении gameState — обновляем URL
  useEffect(() => {
    if (gameState === "vs-ai" || gameState === "local") setModeInUrl(gameState);
  }, [gameState]);

  // Если gameState стал "menu" — выходим
  useEffect(() => {
    if (gameState === "menu") {
      onExitToMenu(); // ← уведомляем App
    }
  }, [gameState, onExitToMenu]);

  return (
    <Board gameState={gameState} setGameState={setGameState} game={game} />
  );
}
