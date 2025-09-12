import { useState } from "react";
import Button from "../Button/Button";
import { GameModeType } from "@/utils/typeBoard/types";
import styles from "./OnlineMenu.module.css";

export default function OnlineMenu({
  onStartGame,
}: {
  onStartGame: (mode: GameModeType) => void;
}) {
  const [gameId, setGameId] = useState("");

  return (
    <div className={styles.menuOverlay}>
      <h1>🌐 Онлайн-игра</h1>
      <div className={styles.menu}>
        {/* Кнопка "Создать игру" */}
        <Button
          className={styles.menuButton}
          onClick={() => onStartGame("online-create")}
        >
          Создать игру
        </Button>

        {/* Подключиться к игре */}
        <div className={styles.joinSection}>
          <input
            type="text"
            placeholder="Введите ID комнаты"
            value={gameId}
            onChange={(e) => setGameId(e.target.value.trim().toUpperCase())}
            className={styles.gameIdInput}
            maxLength={9} // gameId генерируется как Math.random().toString(36).substring(2,9)
          />
          <Button
            className={styles.menuButton}
            disabled={!gameId}
            onClick={() => {
              if (!gameId) return;
              onStartGame(`online-join-${gameId}` as const);
            }}
          >
            Присоединиться
          </Button>
        </div>

        {/* Назад в главное меню */}
        <Button
          className={styles.backButton}
          onClick={() => onStartGame("menu")}
        >
          ← Назад
        </Button>
      </div>
    </div>
  );
}
