import type { PieceType } from "../typeBoard/types";
import { getLegalMoves } from "./getLegalMoves";
import { isKingUnderAttack } from "./isKingUnderAttack";

/**
 * Определяет, находится ли король указанного цвета в положении шаха и у него нет возможных ходов (шах и мат).
 * @param board - Текущее состояние шахматной доски, представленное в виде двумерного массива.
 * @param color - Цвет короля, для которого проверяется шах и мат ("white" или "black").
 * @returns Возвращает true, если король указанного цвета находится в шахе и мате, иначе false.
 */
export function isCheckmate(
  board: PieceType[][],
  color: "white" | "black"
): boolean {
  if (!isKingUnderAttack(board, color)) return false;

  // Проверяем, есть ли хотя бы один легальный ход для любого короля
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getLegalMoves(piece, row, col, board, null);
        if (moves.length > 0) {
          return false; // Есть ход — не мат
        }
      }
    }
  }

  // Если нет ходов — мат
  return true;
}
