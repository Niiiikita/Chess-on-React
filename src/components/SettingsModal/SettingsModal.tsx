import { useSettings } from "@/hooks/useSettings";
import { Settings } from "@/utils/typeBoard/types";
import Button from "@/components/Button/Button";
import styles from "./SettingsModal.module.css";

export default function SettingsModal({ onBack }: { onBack: () => void }) {
  const { settings, setSettings } = useSettings();

  const handleChange = (key: keyof Settings, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={onBack}
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Настройки</h2>
        <div className={styles.settingItem}>
          <label htmlFor="theme">Тема:</label>
          <select
            id="theme"
            value={settings.theme}
            onChange={(e) => handleChange("theme", e.target.value)}
          >
            <option value="dark">Тёмная</option>
            <option value="light">Светлая</option>
          </select>
        </div>

        <div className={styles.settingItem}>
          <input
            id="highlightMoves"
            type="checkbox"
            checked={settings.highlightMoves}
            onChange={(e) => handleChange("highlightMoves", e.target.checked)}
          />
          <label htmlFor="highlightMoves">Подсвечивать возможные ходы</label>
        </div>

        <div className={styles.settingItem}>
          <input
            id="animations"
            type="checkbox"
            checked={settings.animations}
            onChange={(e) => handleChange("animations", e.target.checked)}
          />
          <label htmlFor="animations">Анимации</label>
        </div>

        <div className={styles.settingItem}>
          <input
            id="sound"
            type="checkbox"
            checked={settings.sound}
            onChange={(e) => handleChange("sound", e.target.checked)}
          />
          <label htmlFor="sound">Звук</label>
        </div>

        <Button onClick={onBack}>Назад</Button>
      </div>
    </div>
  );
}
