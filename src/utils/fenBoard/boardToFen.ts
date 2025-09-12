// Конвертирует доску в FEN-строку
// Используется для отправки состояния игры через сокет

import type { PieceType } from "@/utils/typeBoard/types";

// Обратное соответствие: тип+цвет → символ FEN
const reversePieceMap: Record<string, string> = {
  king_white: "K",
  queen_white: "Q",
  rook_white: "R",
  bishop_white: "B",
  knight_white: "N",
  pawn_white: "P",
  king_black: "k",
  queen_black: "q",
  rook_black: "r",
  bishop_black: "b",
  knight_black: "n",
  pawn_black: "p",
};

/**
 * Преобразует шахматную доску в FEN-нотацию.
 * ВНИМАНИЕ: возвращает только часть с фигурами.
 * Остальное (очередь, рокировка и т.д.) можно добавить по необходимости.
 *
 * @param board - Текущая доска 8x8
 * @param nextTurn - Чей следующий ход ("white" | "black")
 * @returns FEN-строка, например: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
 */
export function boardToFen(
  board: PieceType[][],
  nextTurn: "white" | "black"
): string {
  const rows = board.map((row) => {
    let fenRow = "";
    let emptyCount = 0;

    for (const square of row) {
      if (square === null) {
        emptyCount++;
      } else {
        // Закрываем счётчик пустых клеток
        if (emptyCount > 0) {
          fenRow += emptyCount;
          emptyCount = 0;
        }
        // Добавляем фигуру
        const key = `${square.type}_${square.color}`;
        const symbol = reversePieceMap[key];
        if (symbol) {
          fenRow += symbol;
        } else {
          console.warn(`[boardToFen] Неизвестная фигура:`, square);
          fenRow += "X"; // Заглушка
        }
      }
    }

    // Если в конце строки есть пустые клетки
    if (emptyCount > 0) {
      fenRow += emptyCount;
    }

    return fenRow;
  });

  // Полная FEN: позиция + чья очередь + рокировка + взятие на проходе + счётчик ходов + номер хода
  return `${rows.join("/")}/ ${nextTurn === "white" ? "w" : "b"} KQkq - 0 1`;
}
