import { PieceType } from "../typeBoard/types";

export function boardToFen(
  board: PieceType[][],
  nextTurn: "white" | "black"
): string {
  let fen = "";

  for (let row = 0; row < 8; row++) {
    let empty = 0;
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece === null) {
        empty++;
      } else {
        if (empty > 0) {
          fen += empty;
          empty = 0;
        }
        const char =
          piece.type === "knight"
            ? "n"
            : piece.type === "pawn"
            ? "p"
            : piece.type[0];

        // Определяем регистр по цвету фигуры
        fen +=
          piece.color === "white" ? char.toUpperCase() : char.toLowerCase();
      }
    }
    if (empty > 0) fen += empty;
    if (row < 7) fen += "/";
  }

  // Добавляем информацию о следующем ходе, рокировках и т.д.
  fen += ` ${nextTurn === "white" ? "w" : "b"} KQkq - 0 1`;
  return fen;
}
