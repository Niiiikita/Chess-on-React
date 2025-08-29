import { useCallback } from "react";
import { coordsToSquare } from "@/utils/coordsToSquare/coordsToSquare";
import { getLegalMoves } from "@/utils/logicChess/getLegalMoves";
import {
  Board,
  HasKingMovedType,
  HasRookMovedType,
  LastMoveType,
} from "@/utils/typeBoard/types";

export function usePieceDrag({
  board,
  lastMove,
  hasKingMoved,
  hasRookMoved,
  currentPlayer,
  setPossibleMove,
}: {
  board: Board;
  lastMove: LastMoveType;
  hasKingMoved: HasKingMovedType;
  hasRookMoved: HasRookMovedType;
  currentPlayer: "white" | "black";
  setPossibleMove: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const handleDragStart = useCallback(
    (e: React.DragEvent, row: number, col: number) => {
      const piece = board[row]?.[col];
      if (!piece) return;

      // Проверка: ходит ли текущий игрок?
      if (piece.color !== currentPlayer) {
        e.preventDefault();
        return;
      }

      e.dataTransfer.setData("from", coordsToSquare(row, col));
      e.dataTransfer.setData("color", piece.color);

      // Вычисляем возможные ходы
      const moves = getLegalMoves(
        piece,
        row,
        col,
        board,
        lastMove,
        hasKingMoved,
        hasRookMoved
      );
      setPossibleMove(moves);
    },
    [
      board,
      lastMove,
      hasKingMoved,
      hasRookMoved,
      currentPlayer,
      setPossibleMove,
    ]
  );

  return { handleDragStart };
}
