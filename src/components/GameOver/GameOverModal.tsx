import { useChessGame } from "@/hooks/useChessGame";
import type { GameModeType } from "@/utils/typeBoard/types";
import { resetGame } from "@/utils/resetGame/resetGame";
import styles from "./GameOverModal.module.css";

type GameOverModalProps = {
  setGameState: (gameState: GameModeType) => void;
  game?: Partial<ReturnType<typeof useChessGame>>;
  reason?: "resignation" | "opponent_left";
  winner?: string;
  userId?: string;
};

export default function GameOverModal({
  setGameState,
  game,
  reason,
  winner,
  userId,
}: GameOverModalProps) {
  const isWinner = winner === userId;
  let message = "";
  if (reason === "opponent_left") {
    message = isWinner
      ? "Вы победили! Ваш оппонент покинул игру"
      : "Вы проиграли!";
  } else if (reason === "resignation") {
    message = isWinner ? "Вы победили! Оппонент сдался" : "Вы проиграли!";
  }
  const isGameAvailable = !!game;
  const titleGameOver =
    message.length !== 0
      ? message
      : game?.gameOver === "checkmate"
      ? "Мат!"
      : "Пат!";

  return (
    <div className={styles.gameOverModal}>
      <div className={styles.gameOverOptions}>
        <h2>{titleGameOver}</h2>
        {isGameAvailable && (
          <button
            onClick={() =>
              resetGame({
                setBoard: game.setBoard,
                setLastMove: game.setLastMove,
                setPromotion: game.setPromotion,
                setGameOver: game.setGameOver,
                setPossibleMove: game.setPossibleMove,
                setSelectedFrom: game.setSelectedFrom,
                setCurrentPlayer: game.setCurrentPlayer,
                setHint: game.setHint,
                setHasKingMoved: game.setHasKingMoved,
                setHasRookMoved: game.setHasRookMoved,
                setCapturedPieces: game.setCapturedPieces,
              })
            }
          >
            Новая игра
          </button>
        )}

        <button onClick={() => setGameState("menu")}>В меню</button>
      </div>
    </div>
  );
}
