// Конвертирует FEN-строку в двумерный массив доски
// Пример: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR" → PieceType[][]

import type { PieceType } from "@/utils/typeBoard/types";

// Соответствие символов FEN → тип и цвет фигуры
const pieceMap: Record<string, { type: string; color: "white" | "black" }> = {
  k: { type: "king", color: "black" },
  q: { type: "queen", color: "black" },
  r: { type: "rook", color: "black" },
  b: { type: "bishop", color: "black" },
  n: { type: "knight", color: "black" },
  p: { type: "pawn", color: "black" },
  K: { type: "king", color: "white" },
  Q: { type: "queen", color: "white" },
  R: { type: "rook", color: "white" },
  B: { type: "bishop", color: "white" },
  N: { type: "knight", color: "white" },
  P: { type: "pawn", color: "white" },
};

/**
 * Преобразует FEN-нотацию в шахматную доску.
 * @param fen - Строка FEN, например: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
 * @returns Двумерный массив 8x8 с фигурами или null
 */
export function fenToBoard(fen: string): PieceType[][] {
  // Создаём пустую доску 8x8
  const board: PieceType[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  // Берём только первую часть FEN — расположение фигур
  const positionPart = fen.split(" ")[0];

  // Разбиваем на строки (от 8 до 1)
  const rows = positionPart.split("/");

  if (rows.length !== 8) {
    console.warn("[fenToBoard] Неверное количество строк в FEN:", rows.length);
    return board;
  }

  // Обрабатываем каждую строку
  for (let row = 0; row < 8; row++) {
    let col = 0;
    const currentRow = rows[row];

    for (const char of currentRow) {
      if (isNaN(Number(char))) {
        // Это буква — фигура
        const pieceData = pieceMap[char];
        if (pieceData) {
          board[row][col] = pieceData as PieceType;
          col++;
        } else {
          console.warn(`[fenToBoard] Неизвестный символ в FEN: ${char}`);
          col++;
        }
      } else {
        // Это число — пустые клетки
        const emptyCount = Number(char);
        col += emptyCount;
      }

      if (col > 8) {
        console.warn(
          `[fenToBoard] Переполнение строки ${row}: слишком много клеток`
        );
        break;
      }
    }

    if (col !== 8) {
      console.warn(`[fenToBoard] Строка ${row} имеет ${col} клеток вместо 8`);
    }
  }

  return board;
}
