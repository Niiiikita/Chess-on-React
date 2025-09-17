import { memo } from "react";
import Piece from "../Piece/Piece";
import { coordsToSquare } from "@/utils/coordsToSquare/coordsToSquare";
import { GameModeType, PieceType } from "@/utils/typeBoard/types";
import clsx from "clsx";
import styles from "./Square.module.css";

type SquareProps = {
  piece: PieceType | null;
  rowIdx: number;
  colIdx: number;
  isLight: boolean;
  isLastMoveFrom: boolean;
  isLastMoveTo: boolean;
  possibleMove: string[];
  gameState: GameModeType;
  onDragStart: (e: React.DragEvent, row: number, col: number) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: (e: React.MouseEvent) => void;
  transmissionMove?: (
    from: string,
    to: string,
    gameId?: string,
    promotion?: "q" | "r" | "b" | "n"
  ) => void;
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
  onDragStart,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onClick,
}: SquareProps) {
  const squareColor = isLight ? "#f0d9b5" : "#b58863";
  const currentSquare = coordsToSquare(rowIdx, colIdx);

  return (
    <div
      key={`${rowIdx}-${colIdx}`}
      className={clsx(
        styles.square,
        isLastMoveFrom && styles.lastMoveFrom,
        isLastMoveTo && styles.lastMoveTo
      )}
      style={{ backgroundColor: squareColor }}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      onDragStart={(e) => onDragStart(e, rowIdx, colIdx)}
    >
      {/* Подсветка возможного хода */}
      {possibleMove.includes(currentSquare) && <div className={styles.move} />}

      {/* Фигура */}
      {piece && (
        <Piece
          piece={piece}
          isLastMoveFrom={isLastMoveFrom}
          isLastMoveTo={isLastMoveTo}
          onDragStart={(e) => onDragStart(e, rowIdx, colIdx)}
        />
      )}
    </div>
  );
});
