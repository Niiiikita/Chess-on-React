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
  }
  const isGameAvailable = !!game && !gameState?.startsWith("online");
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
