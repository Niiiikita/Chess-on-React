import { useState } from "react";
import Button from "../Button/Button";
import SettingsModal from "../SettingsModal/SettingsModal";
import styles from "./MainMenu.module.css";

export default function MainMenu({
  onStartLocal,
  onStartVsAI,
  onStartOnline,
}: {
  onStartGame: () => void;
  onStartLocal: () => void;
  onStartVsAI: () => void;
  onStartOnline: () => void;
}) {
  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return <SettingsModal onBack={() => setShowSettings(false)} />;
  }
  return (
    <div className={styles.menuOverlay}>
      <h1>Шахматы</h1>
      <div className={styles.menu}>
        <Button
          onClick={onStartLocal}
          className={styles.menuButton}
        >
          Играть вдвоем
        </Button>
        <Button
          onClick={onStartVsAI}
          className={styles.menuButton}
        >
          Играть с компьютером
        </Button>
        <Button
          onClick={onStartOnline}
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
