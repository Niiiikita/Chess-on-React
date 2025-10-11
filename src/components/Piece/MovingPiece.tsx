import { useEffect } from "react";
import pieceIconCache from "@/utils/pieceIconCache/pieceIconCache";
import { PieceType } from "@/utils/typeBoard/types";
import clsx from "clsx";
import styles from "./Piece.module.css";

export default function MovingPiece({
  piece,
  fromRow,
  fromCol,
  toRow,
  toCol,
  boardElement,
  onMoveComplete,
}: {
  piece: PieceType;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  boardElement: HTMLDivElement | null;
  onMoveComplete: () => void;
}) {
  // Вычисляем CSS переменные для анимации
  const getAnimationStyles = () => {
    if (!boardElement) return {};

    const boardRect = boardElement.getBoundingClientRect();
    const squareWidth = boardRect.width / 8;
    const squareHeight = boardRect.height / 8;

    // Вычисляем координаты центров клеток относительно доски
    // Это должно совпадать с позиционированием через flexbox в Square
    const fromX = fromCol * squareWidth + squareWidth / 2;
    const fromY = fromRow * squareHeight + squareHeight / 2;
    const toX = toCol * squareWidth + squareWidth / 2;
    const toY = toRow * squareHeight + squareHeight / 2;

    return {
      "--from-x": `${fromX}px`,
      "--from-y": `${fromY}px`,
      "--to-x": `${toX}px`,
      "--to-y": `${toY}px`,
    } as React.CSSProperties;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onMoveComplete();
    }, 450);

    return () => clearTimeout(timer);
  }, [onMoveComplete]);

  if (!piece) return null;

  const Icon = pieceIconCache[`${piece.type}_${piece.color}`];

  return (
    <div
      className={clsx(styles.piece, styles.movingPiece)}
      style={{
        ...getAnimationStyles(),
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      <Icon style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
