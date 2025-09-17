import { useState } from "react";
import SettingsModal from "../SettingsModal/SettingsModal";
import Button from "../Button/Button";
import { GameModeType } from "@/utils/typeBoard/types";
import styles from "./MainMenu.module.css";

export default function MainMenu({
  onStartGame,
}: {
  onStartGame: (mode: GameModeType) => void;
}) {
  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return <SettingsModal onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className={styles.menuOverlay}>
      <h1>
        <span>♔</span> Шахматы <span>♚</span>
      </h1>
      <div className={styles.menu}>
        <Button
          onClick={() => onStartGame("local")}
          className={styles.menuButton}
        >
          Играть вдвоем
        </Button>
        <Button
          onClick={() => onStartGame("vs-ai")}
          className={styles.menuButton}
        >
          Играть с компьютером
        </Button>
        <Button
          onClick={() => onStartGame("online")}
          className={styles.menuButton}
        >
          Играть онлайн
        </Button>
        <Button
          className={styles.menuButton}
          onClick={() => setShowSettings(true)}
        >
          Настройки
        </Button>
      </div>
    </div>
  );
}
