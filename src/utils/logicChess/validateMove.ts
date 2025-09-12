import type { ChessGameState } from "@/utils/typeBoard/ChessGameState";
import { getLegalMoves } from "./getLegalMoves";

export function validateMove(
  from: { row: number; col: number },
  to: { row: number; col: number },
  context: ChessGameState & { gameState?: string }
): { valid: boolean; message?: string } {
  const { board, currentPlayer, hasKingMoved, hasRookMoved, lastMove } =
    context;

  const piece = board[from.row]?.[from.col];
  if (!piece) {
    return { valid: false, message: "Нет фигуры на начальной позиции" };
  }

  if (piece.color !== currentPlayer) {
    return { valid: false, message: "Не ваш ход" };
  }

  const legalMoves = getLegalMoves(
    piece,
    from.row,
    from.col,
    board,
    lastMove,
    hasKingMoved,
    hasRookMoved
  );

  const toSquare = `${String.fromCharCode(97 + to.col)}${8 - to.row}`;
  if (!legalMoves.includes(toSquare)) {
    return { valid: false, message: "Недопустимый ход для этой фигуры" };
  }

  return { valid: true };
}
