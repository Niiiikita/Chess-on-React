import { useChessGame } from "@/hooks/useChessGame";
import { coordsToSquare } from "../coordsToSquare/coordsToSquare";
import type { GameModeType, PieceType } from "../typeBoard/types";
import { getLegalMoves } from "./getLegalMoves";
import { makeMove } from "./makeMove";

export function handleClickPiece(
  e: React.MouseEvent,
  piece: PieceType,
  rowIdx: number,
  colIdx: number,
  context: ReturnType<typeof useChessGame> & { gameState: GameModeType }
) {
  // Получаем контекст
  const {
    possibleMove,
    setPossibleMove,
    board,
    lastMove,
    selectedFrom,
    setSelectedFrom,
    hasKingMoved,
    hasRookMoved,
    currentPlayer,
    setHint,
  } = context;

  e.preventDefault();

  // 1. Если уже выбрана фигура и текущее поле — в списке возможных ходов
  if (selectedFrom !== null) {
    const currentSquare = coordsToSquare(rowIdx, colIdx);

    // Проверяем, можно ли сюда пойти
    if (possibleMove.includes(currentSquare)) {
      makeMove(selectedFrom, { row: rowIdx, col: colIdx }, { ...context });

      return;
    }

    // 1. Если кликнули не по возможному ходу — сбрасываем выбор
    setPossibleMove([]);
    setSelectedFrom(null);
  }

  // 2. Если клик по фигуре, проверяем, может ли она ходить
  if (piece) {
    // Только если фигура того же цвета, показываем ходы
    if (piece.color === currentPlayer) {
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
    }
  }

  // 3. Если сейчас ход другого цвета — показываем сообщение, что ход другого цвета
  if (piece && piece.color !== currentPlayer) {
    setHint(`Сейчас ход ${currentPlayer === "white" ? "белых" : "чёрных"}!`);
    setTimeout(() => setHint(null), 1500); // исчезает через 1.5 сек
    return;
  }

  // Если клик по пустому полю и ничего не выбрано — ничего не делаем
}
