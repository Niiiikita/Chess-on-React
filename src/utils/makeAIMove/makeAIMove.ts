import { getLegalMoves } from "../logicChess/getLegalMoves";
import { squareToCoords } from "../squareToCoords/squareToCoords";
import { makeMove } from "../logicChess/makeMove";
import { ChessGameState } from "../typeBoard/ChessGameState";

export function makeAIMove(context: ChessGameState & { gameState: "vs-ai" }) {
  // console.log("Бот должен сделать ход", context.currentPlayer);
  const { board, currentPlayer } = context;

  // Только если чёрные — ходят ботом
  if (currentPlayer !== "black") return;

  const allMoves: {
    from: { row: number; col: number };
    to: { row: number; col: number };
  }[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === "black") {
        const moves = getLegalMoves(
          piece,
          row,
          col,
          board,
          context.lastMove,
          context.hasKingMoved,
          context.hasRookMoved
        );
        moves.forEach((move) => {
          const [toRow, toCol] = squareToCoords(move);
          allMoves.push({ from: { row, col }, to: { row: toRow, col: toCol } });
        });
      }
    }
  }

  if (allMoves.length === 0) return;

  const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];

  // Делаем ход и `makeMove` сам обновит состояние
  makeMove(randomMove.from, randomMove.to, { ...context, gameState: "vs-ai" });
}
