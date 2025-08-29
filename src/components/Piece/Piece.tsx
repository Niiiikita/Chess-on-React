import type React from "react";
import { coordsToSquare } from "../../utils/coordsToSquare/coordsToSquare";
import { pieceSymbols } from "../Icons/Icons";
import { PieceProps } from "@/utils/typeBoard/types";
import { getLegalMoves } from "@/utils/logicChess/getLegalMoves";
import styles from "./Piece.module.css";

export default function Piece({
  piece,
  coordsRow,
  coordsCol,
  context,
}: PieceProps) {
  const {
    setPossibleMove,
    board,
    lastMove,
    hasKingMoved,
    hasRookMoved,
    currentPlayer,
  } = context;

  const currentCoords = coordsToSquare(coordsRow, coordsCol);

  const symbol = pieceSymbols[piece.color][piece.type];

  return (
    <div
      className={styles.piece}
      onDragStart={(e) => {
        if (piece.color !== currentPlayer) {
          e.preventDefault(); // Запрещаем перетаскивать чужую фигуру
          return;
        }

        e.dataTransfer.setData("from", currentCoords); // Сохраняем координаты фигуры
        e.dataTransfer.setData("color", piece.color); // Сохраняем цвет фигуры

        const moves = getLegalMoves(
          piece,
          coordsRow,
          coordsCol,
          board,
          lastMove,
          hasKingMoved,
          hasRookMoved
        );
        setPossibleMove(moves);
      }}
      onDragEnd={() => {
        setPossibleMove([]);
      }}
      draggable
    >
      {symbol}
    </div>
  );
}
