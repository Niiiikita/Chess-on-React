import { PieceType } from "@/utils/typeBoard/types";
import { pieceSymbols } from "../Icons/Icons";
import styles from "./CapturedPiecesCount.module.css";

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
export default function CapturedPiecesCount({ captured }: CapturedPiecesProps) {
  return (
    <div className={styles.capturedPieces}>
      {/* Съеденные чёрные фигуры (отображаются сверху) */}
      <div className={styles.capturedPiecesBlack}>
        {captured.black.map((piece, i) => (
          <span
            key={i}
            className={styles.capturedPiecesPiece}
          >
            {piece && pieceSymbols[piece.color][piece.type]}
          </span>
        ))}
      </div>

      {/* Съеденные белые фигуры (отображаются снизу) */}
      <div className={styles.capturedPiecesWhite}>
        {captured.white.map((piece, i) => (
          <span
            key={i}
            className={styles.capturedPiecesPiece}
          >
            {piece && pieceSymbols[piece.color][piece.type]}
          </span>
        ))}
      </div>
    </div>
  );
}
