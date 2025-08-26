import type { PieceType } from "../typeBoard/types";

// Поиск короля на доске
export function findKing(
  board: PieceType[][],
  color: "white" | "black"
): { row: number; col: number } | null {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.type === "king" && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
}
