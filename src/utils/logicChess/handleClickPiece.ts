import { coordsToSquare } from "../coordsToSquare/coordsToSquare";
import type {
  GameMode,
  HasKingMovedType,
  HasRookMovedType,
  LastMoveType,
  PieceType,
} from "../typeBoard/types";
import { getLegalMoves } from "./getLegalMoves";
import { makeMove } from "./makeMove";

export function handleClickPiece(
  e: React.MouseEvent,
  piece: PieceType,
  rowIdx: number,
  colIdx: number,
  possibleMove: string[],
  setPossibleMove: React.Dispatch<React.SetStateAction<string[]>>,
  board: PieceType[][],
  lastMove: LastMoveType,
  selectedFrom: { row: number; col: number } | null,
  setSelectedFrom: React.Dispatch<
    React.SetStateAction<{ row: number; col: number } | null>
  >,
  setBoard: React.Dispatch<React.SetStateAction<PieceType[][]>>,
  setLastMove: React.Dispatch<React.SetStateAction<LastMoveType>>,
  setPromotion: React.Dispatch<
    React.SetStateAction<{
      row: number;
      col: number;
      color: "white" | "black";
    } | null>
  >,
  setGameOver: React.Dispatch<
    React.SetStateAction<"checkmate" | "stalemate" | null>
  >,
  setHasKingMoved: React.Dispatch<React.SetStateAction<HasKingMovedType>>,
  setHasRookMoved: React.Dispatch<React.SetStateAction<HasRookMovedType>>,
  hasKingMoved: HasKingMovedType,
  hasRookMoved: HasRookMovedType,
  currentPlayer: "white" | "black",
  setCurrentPlayer: React.Dispatch<React.SetStateAction<"white" | "black">>,
  setHint: React.Dispatch<React.SetStateAction<string | null>>,
  gameState?: GameMode
) {
  e.preventDefault();

  // 1. Если уже выбрана фигура и текущее поле — в списке возможных ходов
  if (selectedFrom !== null) {
    const currentSquare = coordsToSquare(rowIdx, colIdx);

    // Проверяем, можно ли сюда пойти
    if (possibleMove.includes(currentSquare)) {
      makeMove(
        selectedFrom,
        { row: rowIdx, col: colIdx },
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
        setCurrentPlayer,
        gameState
      );

      return;
    }

    // 1. Если кликнули не по возможному ходу — сбрасываем выбор
    setPossibleMove([]);
    setSelectedFrom(null);
  }

  // 2. Если клик по фигуре и фигура того же цвета — показываем возможные ходы
  if (piece && piece.color === currentPlayer) {
    const moves = getLegalMoves(
      piece,
      rowIdx,
      colIdx,
      board,
      lastMove,
      hasKingMoved,
      hasRookMoved
    );

    setPossibleMove(moves);
    setSelectedFrom({ row: rowIdx, col: colIdx });

    // console.log(selectedFrom);
  }

  // 3. Если сейчас ход другого цвета — показываем сообщение, что ход другого цвета
  if (piece && piece.color !== currentPlayer) {
    setHint(`Сейчас ход ${currentPlayer === "white" ? "белых" : "чёрных"}!`);
    setTimeout(() => setHint(null), 1500); // исчезает через 1.5 сек
    return;
  }

  // Если клик по пустому полю и ничего не выбрано — ничего не делаем
}
