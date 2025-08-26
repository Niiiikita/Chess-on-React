import type { PieceType } from "../typeBoard/types";
import { getLegalMoves } from "./getLegalMoves";
import { isKingUnderAttack } from "./isKingUnderAttack";

/**
 * Определяет, находится ли игрок указанного цвета в пате.
 * Пат наступает, когда у игрока нет допустимых ходов, но его король не находится под шахом.
 * @param board - Текущее состояние шахматной доски, представленное в виде двумерного массива.
 * @param color - Цвет игрока, для которого проверяется пат ('white' или 'black').
 * @returns true, если игрок находится в пате, иначе false.
 */
export function isStalemate(
  board: PieceType[][],
  color: "white" | "black"
): boolean {
  // Если шах — не пат
  if (isKingUnderAttack(board, color)) return false;

  // Проверяем, есть ли ходы
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getLegalMoves(piece, row, col, board, null);
        // Если у игрока есть допустимые ходы — не пат
        if (moves.length > 0) {
          return false;
        }
      }
    }
  }

  // Если нет допустимых ходов — пат
  return true;
}
