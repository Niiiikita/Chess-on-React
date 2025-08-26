import type React from "react";
import { coordsToSquare } from "../../utils/coordsToSquare/coordsToSquare";
import { pieceSymbols } from "../Icons/Icons";
import { PieceProps } from "@/utils/typeBoard/types";
import styles from "./Piece.module.css";

export default function Piece({
  piece,
  coordsRow,
  coordsCol,
  setPossibleMove,
}: PieceProps) {
  const currentCoords = coordsToSquare(coordsRow, coordsCol);

  const symbol = pieceSymbols[piece.color][piece.type];

  return (
    <div
      className={styles.piece}
      onDragStart={(e) => e.dataTransfer.setData("from", currentCoords)}
      onDragEnd={() => {
        setPossibleMove([]);
      }}
      draggable
    >
      {symbol}
    </div>
  );
}
