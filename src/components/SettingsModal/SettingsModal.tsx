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
        <h1>Настройки</h1>
        <div className={styles.setting}>
          <div className={styles.settingItem}>
            <label htmlFor="theme">Тема:</label>
            <select
              id="theme"
              className={styles.select}
              value={settings.theme}
              onChange={(e) => handleChange("theme", e.target.value)}
            >
              <option value="dark">Тёмная</option>
              <option value="light">Светлая</option>
            </select>
          </div>

          <div className={styles.settingItem}>
            <span>Подсвечивать возможные ходы</span>
            <div className={styles.flipswitch}>
              <input
                className={styles.flipswitchCb}
                id="highlightMoves"
                type="checkbox"
                checked={settings.highlightMoves}
                onChange={(e) =>
                  handleChange("highlightMoves", e.target.checked)
                }
              />
              <label
                htmlFor="highlightMoves"
                className={styles.flipswitchLabel}
              >
                <div className={styles.flipswitchInner}></div>
                <div className={styles.flipswitchSwitch}></div>
              </label>
            </div>
          </div>

          <div className={styles.settingItem}>
            <span>Анимации</span>
            <div className={styles.flipswitch}>
              <input
                className={styles.flipswitchCb}
                id="animations"
                type="checkbox"
                checked={settings.animations}
                onChange={(e) => handleChange("animations", e.target.checked)}
              />
              <label
                htmlFor="animations"
                className={styles.flipswitchLabel}
              >
                <div className={styles.flipswitchInner}></div>
                <div className={styles.flipswitchSwitch}></div>
              </label>
            </div>
          </div>

          <div className={styles.settingItem}>
            <span>Звук</span>
            <div className={styles.flipswitch}>
              <input
                className={styles.flipswitchCb}
                id="sound"
                type="checkbox"
                checked={settings.sound}
                onChange={(e) => handleChange("sound", e.target.checked)}
              />
              <label
                htmlFor="sound"
                className={styles.flipswitchLabel}
              >
                <div className={styles.flipswitchInner}></div>
                <div className={styles.flipswitchSwitch}></div>
              </label>
            </div>
          </div>

          <Button
            className={styles.backButton}
            onClick={onBack}
          >
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
}
