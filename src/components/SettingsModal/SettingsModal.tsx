import { useSettings } from "@/hooks/useSettings";
import Button from "@/components/Button/Button";
import SettingsItemInput from "./SettingItemInput/SettingItemInput";
import SettingsItemSelect from "./SettingsItemSelect/SettingsItemSelect";
import { isTMA } from "@telegram-apps/bridge";
import styles from "./SettingsModal.module.css";

export default function SettingsModal({ onBack }: { onBack: () => void }) {
  const { settings, setSettings } = useSettings();

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
          <SettingsItemSelect
            settings={settings}
            setSettings={setSettings}
            name="Тема"
            id="theme"
          >
            <option value="dark">Тёмная</option>
            <option value="light">Светлая</option>
          </SettingsItemSelect>

          {isTMA() && (
            <SettingsItemInput
              settings={settings}
              setSettings={setSettings}
              name="Полноэкранный режим"
              id="fullscreen"
            />
          )}

          <SettingsItemInput
            settings={settings}
            setSettings={setSettings}
            name="Подсвечивать возможные ходы"
            id="highlightMoves"
          />

          <SettingsItemInput
            settings={settings}
            setSettings={setSettings}
            name="Анимации"
            id="animations"
          />

          <SettingsItemInput
            settings={settings}
            setSettings={setSettings}
            name="Звук"
            id="sound"
          />

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
