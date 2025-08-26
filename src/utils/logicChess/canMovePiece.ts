import { coordsToSquare } from "../coordsToSquare/coordsToSquare";
import type { PieceType } from "../typeBoard/types";

/**
 *  @param piece - фигура, которую нужно переместить
 *  @param row - текущая позиция фигуры по горизонтали
 *  @param col - текущая позиция фигуры по вертикали
 *  @param board - доска, на которой находится фигура
 *  @param direction - направление движения фигуры (Движение наверх, если dRow = -1, вниз, если dRow = 1, влево, если dCol = -1, вправо, если dCol = 1)
 *  @returns массив возможных ходов фигуры
 */
export function canMovePiece(
  piece: PieceType,
  row: number,
  col: number,
  board: PieceType[][],
  direction: [number, number]
) {
  const [dRow, dCol] = direction;
  const moves: string[] = [];
  let countMovePiece = 8;

  if (piece?.type === "knight" || piece?.type === "king") {
    countMovePiece = 2;
  }

  for (let i = 1; i < countMovePiece; i++) {
    // Движение наверх, если dRow = -1, вниз, если dRow = 1, влево, если dCol = -1, вправо, если dCol = 1
    const newRow = row + dRow * i;
    const newCol = col + dCol * i;

    // Если новая позиция выходит за границы доски, то выходим из цикла
    if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

    // Получаем фигуру, на которую направляемся
    const target = board[newRow][newCol];

    // Если на новой позиции нет фигуры, то добавляем новую позицию в массив возможных ходов
    if (target === null) {
      // Добавляем новую позицию в массив возможных ходов
      moves.push(coordsToSquare(newRow, newCol));

      // Если на новой позиции есть фигура противоположного цвета, то добавляем в массив
      // возможных ходов новую позицию и выходим из цикла
    } else if (target.color !== piece?.color) {
      // Добавляем новую позицию в массив возможных ходов
      moves.push(coordsToSquare(newRow, newCol));
      break;
    } else {
      break;
    }
  }

  // Возвращаем массив возможных ходов фигуры
  return moves;
}
