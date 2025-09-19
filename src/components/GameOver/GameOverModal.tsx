import { useChessGame } from "@/hooks/useChessGame";
import type { GameModeType } from "@/utils/typeBoard/types";
import { resetGame } from "@/utils/resetGame/resetGame";
import styles from "./GameOverModal.module.css";

type GameOverModalProps = {
  setGameState: (gameState: GameModeType) => void;
  gameState?: GameModeType;
  game?: Partial<ReturnType<typeof useChessGame>>;
  gameId?: string | null;
  reason?: "resignation" | "opponent_left";
  winner?: string;
  userId?: string;
  myColor?: "white" | "black";
  currentPlayer?: "white" | "black";
  resign?: (gameId: string) => void; // ← ТИП
};

export default function GameOverModal({
  gameState,
  setGameState,
  gameId,
  game,
  reason,
  winner,
  userId,
  myColor,
  currentPlayer,
  resign,
}: GameOverModalProps) {
  const isWinner = winner === userId;
  let message = "";
  if (reason === "opponent_left") {
    message = isWinner
      ? "Вы победили! Ваш оппонент покинул игру"
      : "Вы проиграли!";
  } else if (reason === "resignation") {
    message = isWinner ? "Вы победили! Оппонент сдался" : "Вы проиграли!";
  } else if (game?.gameOver === "checkmate") {
    message =
      myColor !== currentPlayer
        ? "Это Мат! Поздравляем, Вы победили!"
        : "Вы проиграли!";
  } else if (game?.gameOver === "stalemate") {
    message = "Ничья!";
  }

  // Если игра не доступна (нет игры) и игра онлайн
  const isGameAvailable = !!game && !gameState?.startsWith("online");
  const titleGameOver =
    typeof message === "string" && message.length > 0 ? message : "Game Over";

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

        <button
          onClick={() => {
            if (gameState?.startsWith("online") && gameId && resign) {
              resign(gameId);
            }
            setGameState("menu");
          }}
        >
          В меню
        </button>
      </div>
    </div>
  );
}
