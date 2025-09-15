import React from "react";
import Button from "../Button/Button";
import styles from "./WaitingForOpponent.module.css";
import { GameModeType } from "@/utils/typeBoard/types";

export function WaitingForOpponent({
  gameId,
  setGameState,
  resignGame,
}: {
  gameId: string;
  setGameState: React.Dispatch<React.SetStateAction<GameModeType>>;
  resignGame: (gameId: string) => void; // ← Тип: функция, принимающая gameId
}) {
  const shareLink = `${window.location.origin}?mode=online-join-${gameId}`;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h2>🎮 Игра создана!</h2>
        <p>
          <strong>ID комнаты:</strong> <code>{gameId}</code>
        </p>
        <p>Отправьте эту ссылку сопернику:</p>
        <input
          type="text"
          value={shareLink}
          readOnly
          onClick={(e) => e.currentTarget.select()}
          className={styles.linkInput}
        />
        <div className={styles.buttons}>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(shareLink);
            }}
          >
            📋 Скопировать ссылку
          </Button>
          <Button
            onClick={() => {
              localStorage.removeItem("onlineGameId");
              resignGame(gameId);
              setGameState("menu");
            }}
          >
            ← Назад
          </Button>
        </div>
      </div>
    </div>
  );
}
