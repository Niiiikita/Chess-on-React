import { squareToCoords } from "../squareToCoords/squareToCoords";
import type {
  HasKingMovedType,
  HasRookMovedType,
  LastMoveType,
  PieceType,
} from "../typeBoard/types";
import { getPossibleMoves } from "./getPossibleMoves";
import { isKingUnderAttack } from "./isKingUnderAttack";

/**
 * Определяет допустимые ходы для заданной фигуры на доске.
 * @param piece - Фигура, для которой рассчитываются допустимые ходы.
 * @param row - Текущая строка фигуры.
 * @param col - Текущий столбец фигуры.
 * @param board - Текущее состояние шахматной доски.
 * @param lastMove - Последний сделанный ход.
 * @returns Массив строк, представляющих допустимые ходы в формате массива строк (к примеру, ["e4", "a1"] и т.д.).
 */
export function getLegalMoves(
  piece: PieceType,
  row: number,
  col: number,
  board: PieceType[][],
  lastMove: LastMoveType,
  hasKingMoved?: HasKingMovedType,
  hasRookMoved?: HasRookMovedType
): string[] {
  // Получаем возможные ходы для фигуры
  const possibleMoves = getPossibleMoves(
    piece,
    row,
    col,
    board,
    lastMove,
    hasKingMoved,
    hasRookMoved
  );
  // Создаем массив для допустимых ходов
  const legalMoves: string[] = [];
  // Проходимся по возможным ходам
  for (const move of possibleMoves) {
    // Преобразуем ход в координаты
    const [toRow, toCol] = squareToCoords(move);

    // Создаём копию доски
    const newBoard = board.map((row) => [...row]);

    // Применяем ход
    newBoard[toRow][toCol] = piece;
    newBoard[row][col] = null;

    // Проверяем, не под шахом ли король после хода
    if (!piece || !piece.color) return [];
    if (!isKingUnderAttack(newBoard, piece?.color)) {
      legalMoves.push(move);
    }
  }

  return legalMoves;
}
