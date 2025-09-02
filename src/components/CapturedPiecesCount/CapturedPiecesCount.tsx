import { memo } from "react";
import { PieceType } from "@/utils/typeBoard/types";
// import { pieceSymbols } from "../LazyPiece/Icons/Icons";
import styles from "./CapturedPiecesCount.module.css";
import pieceIconCache from "@/utils/pieceIconCache/pieceIconCache";
// import LazyPieceIcon from "../LazyPiece/LazyPieceIcon";

type CapturedPiecesProps = {
  captured: {
    white: PieceType[];
    black: PieceType[];
  };
};

/**
 * Отображает количество и символы захваченных шахматных фигур.
 * Этот компонент отображает два раздела:
 * - Захваченные черные фигуры (отображаются сверху)
 * - Захваченные белые фигуры (отображаются снизу)
 * Каждая захваченная фигура представлена соответствующим символом.
 * @param captured Объект, содержащий массивы захваченных фигур для каждого цвета (черные и белые)
 * @returns JSX компонент, отображающий количество и символы захваченных фигур
 */
export default memo(function CapturedPiecesCount({
  captured,
}: CapturedPiecesProps) {
  return (
    <div className={styles.capturedPieces}>
      {/* Съеденные чёрные фигуры */}
      <div className={styles.capturedPiecesBlack}>
        {captured.black.map((piece, i) => {
          if (!piece) return null;
          const Icon = pieceIconCache[`${piece.type}_black`];
          return (
            <span
              key={i}
              className={styles.capturedPiecesPiece}
            >
              {Icon && <Icon />}
            </span>
          );
        })}
      </div>

      {/* Съеденные белые фигуры */}
      <div className={styles.capturedPiecesWhite}>
        {captured.white.map((piece, i) => {
          if (!piece) return null;
          const Icon = pieceIconCache[`${piece.type}_white`];
          return (
            <span
              key={i}
              className={styles.capturedPiecesPiece}
            >
              {Icon && <Icon />}
            </span>
          );
        })}
      </div>
    </div>
  );
});
