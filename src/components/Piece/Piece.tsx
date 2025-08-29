import { memo } from "react";
import { pieceSymbols } from "../Icons/Icons";
import { PieceProps } from "@/utils/typeBoard/types";
import clsx from "clsx";
import styles from "./Piece.module.css";

export default memo(function Piece({
  piece,
  isLastMoveFrom,
  isLastMoveTo,
  onDragStart,
}: PieceProps) {
  const symbol = piece && pieceSymbols[piece.color][piece.type];

  return (
    <div
      className={clsx(
        styles.piece,
        (isLastMoveFrom || isLastMoveTo) && styles.pieceAnimating
      )}
      onDragStart={onDragStart}
      draggable
    >
      {symbol}
    </div>
  );
});
