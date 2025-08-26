import { coordsToSquare } from "../coordsToSquare/coordsToSquare";
import type { LastMoveType, PieceType } from "../typeBoard/types";

/**
 * Рассчитывает возможные ходы пешки по правилу "Взятие на проход" для заданной позиции.
 * @param board - текущая игровая доска, представленная как двумерный массив клеток.
 * @param row - индекс строки клетки.
 * @param col - индекс столбца клетки.
 * @returns Массив строк, представляющих возможные ходы "Взятия на проход" в обозначении клеток.
 */
export function enPassant(
  piece: PieceType,
  row: number,
  col: number,
  lastMove: LastMoveType
): string[] {
  if (!lastMove || lastMove.piece?.type !== "pawn") return [];

  const [fromRow] = lastMove.from;
  const [toRow, toCol] = lastMove.to;
  const opponentPiece = lastMove.piece;

  // Проверяем, что пешка пошла на 2 клетки
  const movedTwo = Math.abs(fromRow - toRow) === 2;
  if (!movedTwo) return [];

  // Проверка: это был первый ход? (для пешки противника)
  const isInitialMove =
    (opponentPiece.color === "white" && fromRow === 6) ||
    (opponentPiece.color === "black" && fromRow === 1);
  if (!isInitialMove) return [];

  // Проверяем, что она справа или слева от нашей пешки
  if (Math.abs(col - toCol) !== 1) return [];

  // Проверяем, что это пешка противника
  if (opponentPiece.color === piece?.color) return [];

  // Проверяем, что пешка находится на 5-й и 4-й горизонтали
  const isOnFifthRank =
    (piece?.color === "white" && row === 3) || // белая на 5-й горизонтали (индекс 3)
    (piece?.color === "black" && row === 4); // чёрная на 4-й горизонтали (индекс 4)

  if (!isOnFifthRank) return [];

  // Теперь можно взять
  const captureRow = piece?.color === "white" ? toRow - 1 : toRow + 1;
  return [coordsToSquare(captureRow, toCol)];
}
