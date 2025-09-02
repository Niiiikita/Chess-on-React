import { setupInitialBoard } from "../setupInitialBoard/setupInitialBoard";
import type {
  HasKingMovedType,
  HasRookMovedType,
  LastMoveType,
  PieceType,
  PromotionType,
  SelectedFromType,
  CapturedPiecesType,
} from "../typeBoard/types";

export type ResetGameArgs = {
  setBoard?: React.Dispatch<React.SetStateAction<PieceType[][]>>;
  setLastMove?: React.Dispatch<React.SetStateAction<LastMoveType>>;
  setPromotion?: React.Dispatch<React.SetStateAction<PromotionType>>;
  setGameOver?: React.Dispatch<
    React.SetStateAction<"checkmate" | "stalemate" | null>
  >;
  setPossibleMove?: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedFrom?: React.Dispatch<React.SetStateAction<SelectedFromType>>;
  setCurrentPlayer?: React.Dispatch<React.SetStateAction<"white" | "black">>;
  setHint?: React.Dispatch<React.SetStateAction<string | null>>;
  setHasKingMoved?: React.Dispatch<React.SetStateAction<HasKingMovedType>>;
  setHasRookMoved?: React.Dispatch<React.SetStateAction<HasRookMovedType>>;
  setCapturedPieces?: React.Dispatch<React.SetStateAction<CapturedPiecesType>>;
};

/**
 * Сбрасывает игровое состояние к начальному.
 * Все аргументы — опциональны, чтобы можно было использовать функцию гибко.
 */
export function resetGame({
  setBoard,
  setLastMove,
  setPromotion,
  setGameOver,
  setPossibleMove,
  setSelectedFrom,
  setCurrentPlayer,
  setHint,
  setHasKingMoved,
  setHasRookMoved,
  setCapturedPieces,
}: ResetGameArgs) {
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
  if (setCapturedPieces) {
    setCapturedPieces({
      white: [],
      black: [],
    });
  }
}
