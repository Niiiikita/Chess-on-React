import type { Board, initialPiece } from "../typeBoard/types";
import { createEmptyBoard } from "../createEmptyboard/createEmptyBoard";

export function setupInitialBoard(): Board {
  const initialBoard = createEmptyBoard();
  const backRow: initialPiece = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];
  for (let col = 0; col < backRow.length; col++) {
    initialBoard[0][col] = { type: backRow[col], color: "black" }; // Расстановка черных фигур
    initialBoard[7][col] = { type: backRow[col], color: "white" }; // Расстановка белых фигур
    initialBoard[1][col] = { type: "pawn", color: "black" }; // Расстановка черных пешек
    initialBoard[6][col] = { type: "pawn", color: "white" }; // Расстановка белых пешек
  }

  //   console.log(initialBoard);
  return initialBoard;
}
