import { memo } from "react";
import clsx from "clsx";
import Button from "../Button/Button";
import { CapturedPiecesType, GameModeType } from "@/utils/typeBoard/types";
import CapturedPiecesCount from "../CapturedPiecesCount/CapturedPiecesCount";
import pieceIconCache from "@/utils/pieceIconCache/pieceIconCache";
import styles from "./CurrentPlayerComponent.module.css";

/**
 * Отображает индикатор текущего игрока и кнопки управления игрой.
 * Этот компонент показывает фигуру текущего игрока (ферзя) и текстовое обозначение,
 * чей сейчас ход. Также предоставляет кнопки для возврата в меню или
 * перезапуска игры.
 * @param props - Свойства компонента.
 * @param props.currentPlayer - Текущий игрок, либо "white", либо "black".
 * @param props.setGameState - Функция для установки состояния игры, используется для перехода в меню.
 * @param props.resetGame - Функция для сброса игры к начальному состоянию.
 * @param props.className - Дополнительные классы для стилизации (необязательно).
 * @returns Отрендеренный компонент, отображающий текущего игрока и кнопки управления.
 */
export default memo(function CurrentPlayerComponent({
  currentPlayer,
  setGameState,
  resetGame,
  className,
  capturedPieces,
}: {
  currentPlayer: "white" | "black";
  setGameState: React.Dispatch<React.SetStateAction<GameModeType>>;
  resetGame: () => void;
  className?: string;
  capturedPieces: CapturedPiecesType;
}) {
  const KingIcon = pieceIconCache[`king_${currentPlayer}`];
  return (
    <div className={clsx(styles.advanceContainer, className)}>
      <div className={clsx(styles.advanceContainerCurrentPlayer, className)}>
        {KingIcon && <KingIcon style={{ width: 30, height: 30 }} />}
        <div className={clsx(styles.advanceContainerDescription, className)}>
          <span>Ход: </span>
          <span
            style={{
              color: currentPlayer === "white" ? "white" : "chocolate",
            }}
          >
            {currentPlayer === "white" ? "Белых" : "Чёрных"}
          </span>
        </div>
      </div>

      <CapturedPiecesCount captured={capturedPieces} />

      <Button
        className={clsx(styles.advanceContainerNewGame)}
        onClick={() => setGameState("menu")}
      >
        Меню
      </Button>
      <Button
        className={styles.advanceContainerReset}
        onClick={resetGame}
      >
        Новая игра
      </Button>
    </div>
  );
});
