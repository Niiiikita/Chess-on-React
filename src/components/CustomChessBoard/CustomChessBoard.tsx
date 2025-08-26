import { useEffect, useState } from "react";
import Board from "../Board/Board";
import MainMenu from "../MainMenu/MainMenu";
import { setModeInUrl } from "../../utils/modeUrl/setModeInUrl";
import { getModeFromUrl } from "../../utils/modeUrl/getModeFromUrl";
import type { GameMode } from "../../utils/typeBoard/types";
import styles from "./CustomChessBoard.module.css";

export default function CustomChessBoard({
  children,
}: {
  children: React.ReactNode;
}) {
  // Состояние игры
  const [gameState, setGameState] = useState<GameMode>("menu");

  // При старте — получаем режим из URL
  useEffect(() => {
    const mode = getModeFromUrl();
    if (mode !== "menu") {
      setGameState(mode);
    }
  }, []);

  // При изменении gameState — обновляем URL
  useEffect(() => {
    if (gameState !== "menu") {
      setModeInUrl(gameState);
    } else {
      setModeInUrl("menu");
    }
  }, [gameState]);

  function startLocalGame() {
    setGameState("local");
  }

  function startVsAI() {
    setGameState("vs-ai");
  }

  function startOnline() {
    // Пока заглушка
    alert("Режим онлайн будет доступен через Telegram");
  }

  // Меню
  if (gameState === "menu") {
    return (
      <MainMenu
        onStartLocal={startLocalGame}
        onStartVsAI={startVsAI}
        onStartOnline={startOnline}
      />
    );
  }

  // Игра
  return (
    <div className={styles.customChessBoard}>
      <Board
        gameState={gameState}
        setGameState={setGameState}
      />
      {children}
    </div>
  );
}
