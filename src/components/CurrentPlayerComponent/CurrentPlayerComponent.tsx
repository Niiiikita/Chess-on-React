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
  gameId,
  resign, // ← ДОБАВЛЯЕМ ЭТОТ ПРОПС!
  // transmissionMove,
  currentPlayer,
  gameState,
  setGameState,
  resetGame,
  className,
  capturedPieces,
}: {
  gameId?: string | null;
  resign?: (gameId: string) => void;
  currentPlayer: "white" | "black";
  gameState: GameModeType;
  setGameState: React.Dispatch<React.SetStateAction<GameModeType>>;
  resetGame: () => void;
  className?: string;
  capturedPieces: CapturedPiecesType;
}) {
  const KingIcon = pieceIconCache[`king_${currentPlayer}`];

  const handleLeaveGame = () => {
    if (!gameId || !resign) return;
    resign(gameId);
  };

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
        onClick={() => {
          setGameState("menu");
          // Сохраняем ID игры, чтобы можно было вернуться
          if (
            gameId &&
            !localStorage.getItem("lastOnlineGameId") &&
            gameState.startsWith("online")
          ) {
            localStorage.setItem("lastOnlineGameId", gameId);
          }
        }}
      >
        Меню
      </Button>

      {(gameState === "local" || gameState === "vs-ai") && (
        <Button
          className={styles.advanceContainerReset}
          onClick={resetGame}
        >
          Новая игра
        </Button>
      )}

      {gameId && (
        <Button
          className={styles.advanceContainerLeave}
          onClick={handleLeaveGame}
        >
          Отключиться
        </Button>
      )}
    </div>
  );
});
