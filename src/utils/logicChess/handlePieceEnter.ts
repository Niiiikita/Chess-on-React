import React from "react";
import { coordsToSquare } from "../coordsToSquare/coordsToSquare";
import { CurrentPlayerType } from "../typeBoard/types";

export function handlePieceEnter(
  e: React.DragEvent,
  rowIdx: number,
  colIdx: number,
  possibleMove: string[],
  currentPlayer: CurrentPlayerType,
  setHighlightedSquare: React.Dispatch<React.SetStateAction<string | null>>
) {
  const square = coordsToSquare(rowIdx, colIdx);
  const draggedColor = e.dataTransfer.getData("color");

  if (draggedColor !== currentPlayer) return;

  if (draggedColor === currentPlayer && possibleMove.includes(square)) {
    setHighlightedSquare(square);
  }
}
