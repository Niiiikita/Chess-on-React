import type { GameModeType, PieceType } from "../../utils/typeBoard/types";
import Button from "../Button/Button";
import { useChessGame } from "@/hooks/useChessGame";
import { makeAIMove } from "@/utils/makeAIMove/makeAIMove";
import styles from "./PopupChoosingFigure.module.css";
import pieceIconCache from "@/utils/pieceIconCache/pieceIconCache";

const pieceToRussian: Record<
  "queen" | "rook" | "bishop" | "knight" | "pawn" | "king",
  string
> = {
  queen: "Королева",
  rook: "Ладья",
  bishop: "Слон",
  knight: "Конь",
  pawn: "Пешка",
  king: "Король",
};

export default function PopupChoosingFigure(
  context: ReturnType<typeof useChessGame> & { gameState: GameModeType }
) {
  const {
    gameState,
    promotion,
    board,
    setBoard,
    setPromotion,
    setLastMove,
    setSelectedFrom,
    setPossibleMove,
    currentPlayer,
    setCurrentPlayer,
  } = context;

  // Убедимся, что promotion существует
  if (!promotion) return null; // или показываем заглушку

  return (
    <div className={styles.promotionModal}>
      <h2>Выберите фигуру</h2>
      <div className={styles.promotionOptions}>
        {(["queen", "rook", "bishop", "knight"] as const).map((figure) => {
          const Icon = pieceIconCache[`${figure}_${promotion.color}`];

          return (
            <Button
              className={styles.promotionButton}
              key={figure}
              onClick={() => {
                const newPiece: PieceType = {
                  type: figure,
                  color: promotion.color,
                };

                const updatedBoard = board.map((row) => [...row]);
                updatedBoard[promotion.row][promotion.col] = newPiece;

                setBoard(updatedBoard);
                setLastMove({
                  from: [promotion.row, promotion.col],
                  to: [promotion.row, promotion.col],
                  piece: newPiece,
                });
                setSelectedFrom(null);
                setPossibleMove([]);
                setPromotion(null);

                setCurrentPlayer(currentPlayer === "white" ? "black" : "white");

                if (gameState === "vs-ai" && newPiece.color === "white") {
                  setTimeout(() => {
                    makeAIMove({
                      ...context,
                      board: updatedBoard,
                      currentPlayer: "black",
                      lastMove: {
                        from: [promotion.row, promotion.col],
                        to: [promotion.row, promotion.col],
                        piece: newPiece,
                      },
                      gameState: "vs-ai" as const,
                    });
                  }, 600);
                }
              }}
            >
              {Icon && <Icon className={styles.popupPieceIcon} />}
              {pieceToRussian[figure]}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
