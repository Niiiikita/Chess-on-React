import type { GameModeType } from "../../utils/typeBoard/types";
import Button from "../Button/Button";
import { useChessGame } from "@/hooks/useChessGame";
import { makeAIMove } from "@/utils/makeAIMove/makeAIMove";
import styles from "./PopupChoosingFigure.module.css";
import pieceIconCache from "@/utils/pieceIconCache/pieceIconCache";
import { coordsToSquare } from "@/utils/coordsToSquare/coordsToSquare";

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

type PopupChoosingFigureProps = {
  game: ReturnType<typeof useChessGame>;
  gameState: GameModeType;
  gameId?: string;
  transmissionMove?: (
    from: string,
    to: string,
    gameId: string,
    promotion?: "q" | "r" | "b" | "n"
  ) => void;
};

export default function PopupChoosingFigure({
  game,
  gameState,
  gameId,
  transmissionMove,
}: PopupChoosingFigureProps) {
  const {
    promotion,
    board,
    setBoard,
    setPromotion,
    currentPlayer,
    setCurrentPlayer,
  } = game;

  const pieceSymbolMap: Record<
    "queen" | "rook" | "bishop" | "knight",
    "q" | "r" | "b" | "n"
  > = {
    queen: "q",
    rook: "r",
    bishop: "b",
    knight: "n",
  };

  return (
    <div className={styles.promotionModal}>
      <h2>Выберите фигуру</h2>
      <div className={styles.promotionOptions}>
        {(["queen", "rook", "bishop", "knight"] as const).map((figure) => {
          const Icon = pieceIconCache[`${figure}_${promotion?.color}`];

          return (
            <Button
              className={styles.promotionButton}
              key={figure}
              onClick={() => {
                if (!promotion) return null;

                const chessPromotion = pieceSymbolMap[figure];

                // БЕРЕМ КООРДИНАТЫ ИЗ lastMove — ОНИ УЖЕ УСТАНОВЛЕНЫ makeMove
                const fromSquare = coordsToSquare(
                  promotion.fromRow,
                  promotion.fromCol
                );
                const toSquare = coordsToSquare(
                  promotion.toRow,
                  promotion.toCol
                );

                console.log(
                  "[PopupChoosingFigure] Исходная позиция:",
                  fromSquare
                );
                console.log(
                  "[PopupChoosingFigure] Цель превращения:",
                  toSquare
                );

                // ОТПРАВЛЯЕМ ХОД С PROMOTION — ЭТО ОКОНЧАТЕЛЬНЫЙ ХОД!
                if (gameId && transmissionMove) {
                  transmissionMove(
                    fromSquare,
                    toSquare,
                    gameId,
                    chessPromotion
                  );
                }

                // ОБНОВЛЯЕМ ДОСКУ — СТАВИМ НОВУЮ ФИГУРУ
                const updatedBoard = board.map((row) => [...row]);
                updatedBoard[promotion.toRow][promotion.toCol] = {
                  type: figure,
                  color: promotion.color,
                };
                setBoard(updatedBoard);

                setPromotion(null);
                setCurrentPlayer(currentPlayer === "white" ? "black" : "white");

                if (gameState === "vs-ai" && promotion.color === "white") {
                  setTimeout(() => {
                    makeAIMove({
                      ...game,
                      board: updatedBoard,
                      currentPlayer: "black",
                      lastMove: {
                        from: [promotion.fromRow, promotion.fromCol],
                        to: [promotion.toRow, promotion.toCol],
                        piece: { type: figure, color: promotion.color },
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
