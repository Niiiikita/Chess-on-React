import { useState } from "react";
import { setupInitialBoard } from "../utils/setupInitialBoard/setupInitialBoard";
import type {
  CapturedPiecesType,
  CurrentPlayerType,
  GameOverType,
  HasKingMovedType,
  HasRookMovedType,
  LastMoveType,
  PromotionType,
  SelectedFromType,
} from "../utils/typeBoard/types";

/**
 * Пользовательский хук для управления состоянием шахматной игры.
 * Этот хук инкапсулирует состояние игры, включая доску, текущего игрока, возможные ходы,
 * выбранную фигуру, последний ход, состояние превращения, статус окончания игры,
 * состояние перемещения короля и ладьи, а также информацию о подсказках.
 * Предоставляет сеттеры и геттеры для каждой переменной состояния.
 * @returns Объект, содержащий переменные состояния игры и их соответствующие сеттеры.
 */
export function useChessGame() {
  // Состояние текущего игрока
  const [currentPlayer, setCurrentPlayer] =
    useState<CurrentPlayerType>("white");
  // Состояние игрового поля
  const [board, setBoard] = useState(setupInitialBoard());
  // Состояние возможных ходов
  const [possibleMove, setPossibleMove] = useState<string[]>([]);
  // Состояние выбранной фигуры
  const [selectedFrom, setSelectedFrom] = useState<SelectedFromType>(null);
  // Состояние последнего хода
  const [lastMove, setLastMove] = useState<LastMoveType>(null);
  // Состояние превращения
  const [promotion, setPromotion] = useState<PromotionType>(null);
  // Состояние окончания игры
  const [gameOver, setGameOver] = useState<GameOverType>(null);
  // Состояние перемещения короля
  const [hasKingMoved, setHasKingMoved] = useState<HasKingMovedType>({
    white: false,
    black: false,
  });
  // Состояние перемещения ладьи
  const [hasRookMoved, setHasRookMoved] = useState<HasRookMovedType>({
    white: { left: false, right: false },
    black: { left: false, right: false },
  });

  // Состояние подсказки
  const [hint, setHint] = useState<string | null>(null);

  // Состояние таймаута подсказки
  const [hintTimeout, setHintTimeout] = useState<NodeJS.Timeout | null>(null);

  const setHintWithTimer = (message: string | null) => {
    if (hintTimeout) clearTimeout(hintTimeout);

    if (message) {
      const timeoutId = setTimeout(() => {
        setHint(null);
      }, 1500);
      setHintTimeout(timeoutId);
    }
    setHint(message);
  };

  // Состояние захваченных фигур
  const [capturedPieces, setCapturedPieces] = useState<CapturedPiecesType>({
    white: [],
    black: [],
  });
  // Состояние выделенной клетки
  const [highlightedSquare, setHighlightedSquare] = useState<string | null>(
    null
  );

  return {
    board,
    setBoard,
    lastMove,
    setLastMove,
    selectedFrom,
    setSelectedFrom,
    possibleMove,
    setPossibleMove,
    promotion,
    setPromotion,
    gameOver,
    setGameOver,
    hasKingMoved,
    setHasKingMoved,
    hasRookMoved,
    setHasRookMoved,
    currentPlayer,
    setCurrentPlayer,
    hint,
    setHint,
    setHintWithTimer,
    capturedPieces,
    setCapturedPieces,
    highlightedSquare,
    setHighlightedSquare,
  };
}
