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
  context: ReturnType<typeof useChessGame> & {
    gameState: GameModeType;
    gameId?: string | null;
    transmissionMove?: (
      from: string,
      to: string,
      gameId?: string,
      promotion?: "q" | "r" | "b" | "n"
    ) => void;
  }
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
    setHintWithTimer,
  } = context;

  e.preventDefault();

  // 1. Если уже выбрана фигура и текущее поле — в списке возможных ходов
  if (selectedFrom !== null) {
    const currentSquare = coordsToSquare(rowIdx, colIdx);

    // Проверяем, можно ли сюда пойти
    if (possibleMove.includes(currentSquare)) {
      // ✅ ВСЕГДА вызываем makeMove — он знает всё: превращение, взятие на проходе, рокировку
      makeMove(
        { row: selectedFrom.row, col: selectedFrom.col },
        { row: rowIdx, col: colIdx },
        { ...context }
      );

      setSelectedFrom(null);
      setPossibleMove([]);
      return;
    }
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
    setHintWithTimer(
      `Сейчас ход ${currentPlayer === "white" ? "белых" : "чёрных"}!`
    );
  } else {
    setHintWithTimer(null); // можно опционально
  }

  // Если клик по пустому полю и ничего не выбрано — ничего не делаем
}
