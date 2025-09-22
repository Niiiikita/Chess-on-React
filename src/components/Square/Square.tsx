import { memo } from "react";
import Piece from "../Piece/Piece";
import { coordsToSquare } from "@/utils/coordsToSquare/coordsToSquare";
import { GameModeType, PieceType } from "@/utils/typeBoard/types";
import clsx from "clsx";
import styles from "./Square.module.css";
import { useSettings } from "@/hooks/useSettings";

type SquareProps = {
  piece: PieceType | null;
  rowIdx: number;
  colIdx: number;
  isLight: boolean;
  isLastMoveFrom: boolean;
  isLastMoveTo: boolean;
  possibleMove: string[];
  gameState: GameModeType;
  onClick: (e: React.MouseEvent) => void;

  gameId?: string | null;
};

export default memo(function Square({
  piece,
  rowIdx,
  colIdx,
  isLight,
  isLastMoveFrom,
  isLastMoveTo,
  possibleMove,
  onClick,
}: SquareProps) {
  const squareColor = isLight ? "#f0d9b5" : "#b58863";
  const currentSquare = coordsToSquare(rowIdx, colIdx);

  const { settings } = useSettings();

  return (
    <div
      key={`${rowIdx}-${colIdx}`}
      className={clsx(
        styles.square,
        isLastMoveFrom && styles.lastMoveFrom,
        isLastMoveTo && styles.lastMoveTo
      )}
      style={{ backgroundColor: squareColor }}
      onClick={onClick}
    >
      {/* Подсветка возможного хода */}
      {settings.highlightMoves && possibleMove.includes(currentSquare) && (
        <div className={styles.move} />
      )}

      {/* Фигура */}
      {piece && (
        <Piece
          piece={piece}
          isLastMoveFrom={isLastMoveFrom}
          isLastMoveTo={isLastMoveTo}
        />
      )}
    </div>
  );
});
