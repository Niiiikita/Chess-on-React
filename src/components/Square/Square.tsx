import { memo } from "react";
import Piece from "../Piece/Piece";
import { coordsToSquare } from "@/utils/coordsToSquare/coordsToSquare";
import { handlePieceEnter } from "@/utils/logicChess/handlePieceEnter";
import { handleClickPiece } from "@/utils/logicChess/handleClickPiece";
import handlePieceMove from "@/utils/logicChess/handlePieceMove";
import { useChessGame } from "@/hooks/useChessGame";
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
  game: ReturnType<typeof useChessGame>;
  gameState: GameModeType;
  handleDragStart: (e: React.DragEvent, row: number, col: number) => void;
  setHighlightedSquare: React.Dispatch<React.SetStateAction<string | null>>;
};

export default memo(function Square({
  piece,
  rowIdx,
  colIdx,
  isLight,
  isLastMoveFrom,
  isLastMoveTo,
  possibleMove,
  game,
  gameState,
  handleDragStart,
  setHighlightedSquare,
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
      onDragEnter={(e) =>
        handlePieceEnter(
          e,
          rowIdx,
          colIdx,
          possibleMove,
          game.currentPlayer,
          setHighlightedSquare
        )
      }
      onDragLeave={() => setHighlightedSquare(null)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        handlePieceMove(e, rowIdx, colIdx, { ...game, gameState });
        setHighlightedSquare(null);
      }}
      onClick={(e) => {
        handleClickPiece(e, piece, rowIdx, colIdx, { ...game, gameState });
      }}
    >
      {/* Подсветка возможного хода */}
      {possibleMove.includes(currentSquare) && <div className={styles.move} />}

      {/* Фигура */}
      {piece && (
        <Piece
          piece={piece}
          isLastMoveFrom={isLastMoveFrom}
          isLastMoveTo={isLastMoveTo}
          onDragStart={(e) => handleDragStart(e, rowIdx, colIdx)}
        />
      )}
    </div>
  );
});
