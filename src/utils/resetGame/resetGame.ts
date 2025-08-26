import { setupInitialBoard } from "../setupInitialBoard/setupInitialBoard";
import type {
  HasKingMovedType,
  HasRookMovedType,
  LastMoveType,
  PieceType,
  PromotionType,
  SelectedFromType,
} from "../typeBoard/types";

/**
 * Восстанавливает начальную конфигурацию игрового состояния.
 * @param e - Отключение действий браузера по умолчанию.
 * @param setBoard - Функция для сброса шахматной доски в исходное состояние.
 * @param setLastMove - Функция для очистки информации о последнем ходе.
 * @param setPromotion - Функция для сброса состояния превращения.
 * @param setGameOver - Функция для сброса состояния окончания игры.
 * @param setPossibleMove - Функция для очистки списка возможных ходов.
 * @param setSelectedFrom - Функция для сброса позиции выбранной фигуры.
 * @param setCurrentPlayer - Функция для сброса состояния текущего игрока.
 * @param setHint - Функция для сброса состояния подсказки.
 */
export function resetGame(
  e: React.MouseEvent<HTMLButtonElement>,
  setBoard?: React.Dispatch<React.SetStateAction<PieceType[][]>>,
  setLastMove?: React.Dispatch<React.SetStateAction<LastMoveType>>,
  setPromotion?: React.Dispatch<React.SetStateAction<PromotionType>>,
  setGameOver?: React.Dispatch<
    React.SetStateAction<null | "checkmate" | "stalemate">
  >,
  setPossibleMove?: React.Dispatch<React.SetStateAction<string[]>>,
  setSelectedFrom?: React.Dispatch<React.SetStateAction<SelectedFromType>>,
  setCurrentPlayer?: React.Dispatch<React.SetStateAction<"white" | "black">>,
  setHint?: React.Dispatch<React.SetStateAction<string | null>>,
  setHasKingMoved?: React.Dispatch<React.SetStateAction<HasKingMovedType>>,
  setHasRookMoved?: React.Dispatch<React.SetStateAction<HasRookMovedType>>
) {
  e.preventDefault();
  // Сброс всех состояний
  if (setBoard) setBoard(setupInitialBoard());
  if (setLastMove) setLastMove(null);
  if (setPromotion) setPromotion(null);
  if (setGameOver) setGameOver(null);
  if (setPossibleMove) setPossibleMove([]);
  if (setSelectedFrom) setSelectedFrom(null);
  if (setCurrentPlayer) setCurrentPlayer("white");
  if (setHint) setHint(null);
  if (setHasKingMoved)
    setHasKingMoved({
      white: false,
      black: false,
    });
  if (setHasRookMoved)
    setHasRookMoved({
      white: { left: false, right: false },
      black: { left: false, right: false },
    });
}
