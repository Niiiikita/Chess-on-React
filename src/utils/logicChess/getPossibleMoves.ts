import type {
  HasKingMovedType,
  HasRookMovedType,
  LastMoveType,
  PieceType,
} from "../typeBoard/types";
import { coordsToSquare } from "../coordsToSquare/coordsToSquare";
import { canMovePiece } from "./canMovePiece";
import { enPassant } from "./enPassant";
import { isKingUnderAttack } from "./isKingUnderAttack";

export function getPossibleMoves(
  piece: PieceType,
  row: number,
  col: number,
  board: PieceType[][],
  lastMove: LastMoveType,
  hasKingMoved?: HasKingMovedType,
  hasRookMoved?: HasRookMovedType
) {
  const possibleMoves: string[] = [];
  switch (piece?.type) {
    case "pawn":
      if (piece.color === "white") {
        // 1. Ход вперёд на 1 клетку
        const newRow1 = row - 1;
        if (newRow1 >= 0 && board[newRow1][col] === null) {
          possibleMoves.push(coordsToSquare(newRow1, col));

          // 2. Первый ход — на 2 клетки
          if (row === 6) {
            const newRow2 = row - 2;
            if (board[newRow2][col] === null) {
              possibleMoves.push(coordsToSquare(newRow2, col));
            }
          }
        }

        // 3. Взятие по диагоналям
        for (const dCol of [-1, 1]) {
          const newRow = row - 1;
          const newCol = col + dCol;
          if (newRow >= 0 && newCol >= 0 && newCol < 8) {
            const target = board[newRow][newCol];
            if (target !== null && target.color !== piece.color) {
              possibleMoves.push(coordsToSquare(newRow, newCol));
            }
          }
        }

        // 4. Взятие на проходе
        possibleMoves.push(...enPassant(piece, row, col, lastMove));

        // console.log("Предыдущий ход: ", lastMove);
      } else {
        // Для чёрной пешки — аналогично, но вниз
        const newRow1 = row + 1;
        if (newRow1 < 8 && board[newRow1][col] === null) {
          possibleMoves.push(coordsToSquare(newRow1, col));

          if (row === 1) {
            const newRow2 = row + 2;
            if (board[newRow2][col] === null) {
              possibleMoves.push(coordsToSquare(newRow2, col));
            }
          }
        }

        for (const dCol of [-1, 1]) {
          const newRow = row + 1;
          const newCol = col + dCol;
          if (newRow < 8 && newCol >= 0 && newCol < 8) {
            const target = board[newRow][newCol];
            if (target !== null && target.color !== piece.color) {
              possibleMoves.push(coordsToSquare(newRow, newCol));
            }
          }
        }

        // 4. Взятие на проходе
        possibleMoves.push(...enPassant(piece, row, col, lastMove));
      }
      break;
    case "knight":
      if (piece.color === "white") {
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-2, 1])); // движение вверх и вправо
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-2, -1])); // движение вверх и влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, 2])); // движение вверх и вправо
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, 2])); // движение вниз и впрово
        possibleMoves.push(...canMovePiece(piece, row, col, board, [2, 1])); // движение вниз и вправо
        possibleMoves.push(...canMovePiece(piece, row, col, board, [2, -1])); // движение вниз и влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, -2])); // движение вверх и влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, -2])); // движение вниз и влево
      } else {
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-2, 1])); // движение вверх и вправо
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-2, -1])); // движение вверх и влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, 2])); // движение вверх и вправо
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, 2])); // движение вниз и впрово
        possibleMoves.push(...canMovePiece(piece, row, col, board, [2, 1])); // движение вниз и вправо
        possibleMoves.push(...canMovePiece(piece, row, col, board, [2, -1])); // движение вниз и влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, -2])); // движение вверх и влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, -2])); // движение вниз и влево
      }
      break;
    case "bishop":
      if (piece.color === "white") {
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, -1])); // движение вверх и влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, 1])); // движение вверх и вправо
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, -1])); // движение вниз и влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, 1])); // движение вниз и вправо
      } else {
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, -1])); // движение вверх и влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, 1])); // движение вверх и вправо
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, -1])); // движение вниз и влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, 1])); // движение вниз и вправо
      }
      break;
    case "rook":
      if (piece.color === "white") {
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, 0])); // движение вверх
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, 0])); // движение вниз
        possibleMoves.push(...canMovePiece(piece, row, col, board, [0, -1])); // движение влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [0, 1])); // движение вправо
      } else {
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, 0])); // движение вверх
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, 0])); // движение вниз
        possibleMoves.push(...canMovePiece(piece, row, col, board, [0, -1])); // движение влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [0, 1])); // движение вправо
      }
      break;
    case "king":
      possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, -1]));
      possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, 1]));
      possibleMoves.push(...canMovePiece(piece, row, col, board, [1, -1]));
      possibleMoves.push(...canMovePiece(piece, row, col, board, [1, 1]));
      possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, 0]));
      possibleMoves.push(...canMovePiece(piece, row, col, board, [1, 0]));
      possibleMoves.push(...canMovePiece(piece, row, col, board, [0, -1]));
      possibleMoves.push(...canMovePiece(piece, row, col, board, [0, 1]));

      // Проверяем возможность рокировки
      if (hasKingMoved && !hasKingMoved[piece.color]) {
        const rank = piece.color === "white" ? 7 : 0;

        // Короткая рокировка (O-O)
        if (
          hasRookMoved &&
          !hasRookMoved[piece.color].right &&
          board[rank][5] === null && // f1/f8
          board[rank][6] === null && // g1/g8
          !isKingUnderAttack(board, piece.color) &&
          !isKingUnderAttack(
            [...board.map((row) => [...row])]
              .map((r, i) => (i === rank ? [...r] : r))
              .map((row, i) =>
                i === rank
                  ? row.map((cell, j) =>
                      j === 4
                        ? null
                        : cell === null && j === 5
                        ? { type: "king", color: piece.color }
                        : cell
                    )
                  : row
              ),
            piece.color
          ) &&
          !isKingUnderAttack(
            [...board.map((r) => [...r])]
              .map((r, i) => (i === rank ? [...r] : r))
              .map((row, i) =>
                i === rank
                  ? row.map((cell, j) =>
                      j === 4
                        ? null
                        : cell === null && j === 6
                        ? { type: "king", color: piece.color }
                        : cell
                    )
                  : row
              ),
            piece.color
          )
        ) {
          possibleMoves.push(coordsToSquare(rank, 6)); // g1/g8
        }

        // Длинная рокировка
        if (
          hasRookMoved &&
          !hasRookMoved[piece.color].left &&
          // Проверяем, что между королем и ладьей нет других фигур
          board[rank][1] === null && // b1/b8
          board[rank][2] === null && // c1/c8
          board[rank][3] === null && // d1/d8
          !isKingUnderAttack(board, piece.color) &&
          !isKingUnderAttack(
            [...board.map((r) => [...r])]
              .map((r, i) => (i === rank ? [...r] : r))
              .map((row, i) =>
                i === rank
                  ? row.map((cell, j) =>
                      j === 4
                        ? null
                        : cell === null && j === 3
                        ? { type: "king", color: piece.color }
                        : cell
                    )
                  : row
              ),
            piece.color
          ) &&
          !isKingUnderAttack(
            [...board.map((r) => [...r])]
              .map((r, i) => (i === rank ? [...r] : r))
              .map((row, i) =>
                i === rank
                  ? row.map((cell, j) =>
                      j === 4
                        ? null
                        : cell === null && j === 2
                        ? { type: "king", color: piece.color }
                        : cell
                    )
                  : row
              ),
            piece.color
          )
        ) {
          possibleMoves.push(coordsToSquare(rank, 2)); // c1/c8
        }
      }

      break;
    case "queen":
      if (piece.color === "white") {
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, 0])); // движение вверх
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, -1])); // движение вверх и влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, 1])); // движение вверх и вправо
        possibleMoves.push(...canMovePiece(piece, row, col, board, [0, -1])); // движение влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [0, 1])); // движение вправо
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, 0])); // движение вниз
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, -1])); // движение вниз и влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, 1])); // движение вниз и вправо
      } else {
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, 0])); // движение вверх
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, -1])); // движение вверх и влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [-1, 1])); // движение вверх и вправо
        possibleMoves.push(...canMovePiece(piece, row, col, board, [0, -1])); // движение влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [0, 1])); // движение вправо
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, 0])); // движение вниз
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, -1])); // движение вниз и влево
        possibleMoves.push(...canMovePiece(piece, row, col, board, [1, 1])); // движение вниз и вправо
      }

      break;
  }

  // console.log("Оригинальный (не отфильтрованный) массив", possibleMoves);

  return possibleMoves;
}
