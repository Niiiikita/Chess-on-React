import { coordsToSquare } from "../coordsToSquare/coordsToSquare";
import type { Board } from "../typeBoard/types";
import { findKing } from "./findKing";
import { getPossibleMoves } from "./getPossibleMoves";

// Проверяем, под шахом ли король
export function isKingUnderAttack(
  board: Board,
  color: "white" | "black"
): boolean {
  // Находим позицию короля
  const kingPos = findKing(board, color);
  if (!kingPos) return false;

  // Находим позицию фигуры противника
  const opponentColor = color === "white" ? "black" : "white";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === opponentColor) {
        // Получаем возможные ходы фигуры
        const moves = getPossibleMoves(piece, row, col, board, null);

        // Проверяем, есть ли король в списке возможных ходов
        if (moves.includes(coordsToSquare(kingPos.row, kingPos.col))) {
          return true;
        }
      }
    }
  }

  return false;
}
