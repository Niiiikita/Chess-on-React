import { getLegalMoves } from "../logicChess/getLegalMoves";
import { makeMove } from "../logicChess/makeMove";
import { squareToCoords } from "../squareToCoords/squareToCoords";
import type {
  Board,
  CurrentPlayerType,
  GameOverType,
  HasKingMovedType,
  HasRookMovedType,
  LastMoveType,
  PromotionType,
  SelectedFromType,
} from "../typeBoard/types";

export function makeAIMove(
  currentPlayer: CurrentPlayerType,
  board: Board,
  lastMove: LastMoveType,
  setBoard: React.Dispatch<React.SetStateAction<Board>>,
  setLastMove: React.Dispatch<React.SetStateAction<LastMoveType>>,
  setSelectedFrom: React.Dispatch<React.SetStateAction<SelectedFromType>>,
  setPossibleMove: React.Dispatch<React.SetStateAction<string[]>>,
  setPromotion: React.Dispatch<React.SetStateAction<PromotionType>>,
  setGameOver: React.Dispatch<React.SetStateAction<GameOverType>>,
  setCurrentPlayer: React.Dispatch<React.SetStateAction<CurrentPlayerType>>,
  setHasKingMoved: React.Dispatch<React.SetStateAction<HasKingMovedType>>,
  setHasRookMoved: React.Dispatch<React.SetStateAction<HasRookMovedType>>
) {
  // Только если текущий игрок — чёрный
  if (currentPlayer !== "black") return;

  // Собираем все возможные ходы для чёрных
  const allMoves: {
    from: { row: number; col: number };
    to: { row: number; col: number };
  }[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === "black") {
        const moves = getLegalMoves(piece, row, col, board, lastMove);
        moves.forEach((move) => {
          const [toRow, toCol] = squareToCoords(move);
          allMoves.push({
            from: { row, col },
            to: { row: toRow, col: toCol },
          });
        });
      }
    }
  }

  // Если нет ходов — выходим (мат или пат)
  if (allMoves.length === 0) return;

  // Выбираем случайный ход
  const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];

  // Делаем ход
  makeMove(
    randomMove.from,
    randomMove.to,
    board,
    setBoard,
    // lastMove,
    setLastMove,
    setSelectedFrom,
    setPossibleMove,
    setPromotion,
    setGameOver,
    setHasKingMoved,
    setHasRookMoved,
    currentPlayer,
    setCurrentPlayer, // ✅ Добавь
    "vs-ai" // ✅ Явно передай gameState, чтобы бот мог снова сходить
  );
}
