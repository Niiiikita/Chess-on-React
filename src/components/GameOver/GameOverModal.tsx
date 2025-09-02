import type { GameModeType } from "@/utils/typeBoard/types";
import { resetGame } from "@/utils/resetGame/resetGame";
import styles from "./GameOverModal.module.css";
import { useChessGame } from "@/hooks/useChessGame";

type GameOverModalProps = {
  setGameState: (gameState: GameModeType) => void;
} & ReturnType<typeof useChessGame>;

export default function GameOverModal({
  setGameState,
  gameOver,
  // Распаковываем все сеттеры, которые нужны resetGame
  setBoard,
  setLastMove,
  setPromotion,
  setGameOver,
  setPossibleMove,
  setSelectedFrom,
  setCurrentPlayer,
  setHint,
  setHasKingMoved,
  setHasRookMoved,
  setCapturedPieces,
}: GameOverModalProps) {
  return (
    <div className={styles.gameOverModal}>
      <div className={styles.gameOverOptions}>
        <h2>{gameOver === "checkmate" ? "Мат!" : "Пат!"}</h2>
        <button
          onClick={() =>
            resetGame({
              setBoard,
              setLastMove,
              setPromotion,
              setGameOver,
              setPossibleMove,
              setSelectedFrom,
              setCurrentPlayer,
              setHint,
              setHasKingMoved,
              setHasRookMoved,
              setCapturedPieces,
            })
          }
        >
          Новая игра
        </button>
        <button onClick={() => setGameState("menu")}>В меню</button>
      </div>
    </div>
  );
}
