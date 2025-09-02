import { memo } from "react";
import pieceIconCache from "@/utils/pieceIconCache/pieceIconCache";
import { PieceType } from "@/utils/typeBoard/types";
import clsx from "clsx";
import styles from "./Piece.module.css";

export default memo(function Piece({
  piece,
  isLastMoveFrom,
  isLastMoveTo,
  onDragStart,
}: {
  piece: PieceType;
  isLastMoveFrom: boolean;
  isLastMoveTo: boolean;
  onDragStart: (e: React.DragEvent) => void;
}) {
  if (!piece) return null;

  const Icon = pieceIconCache[`${piece.type}_${piece.color}`];

  return (
    <div
      className={clsx(
        styles.piece,
        (isLastMoveFrom || isLastMoveTo) && styles.pieceAnimating
      )}
      onDragStart={onDragStart}
      draggable
    >
      <Icon style={{ width: "100%", height: "100%" }} />
    </div>
  );
});
