import { Settings } from "@/utils/typeBoard/types";
import styles from "./SettingsItemSelect.module.css";

export default function SettingsItemSelect(props: {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  name: string;
  id: string;
  children?: React.ReactNode;
}) {
  const handleChange = (key: keyof Settings, value: boolean | string) => {
    props.setSettings((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <div className={styles.settingItem}>
      <label htmlFor="theme">{props.name}</label>
      <select
        id={props.id}
        className={styles.select}
        value={props.settings.theme}
        onChange={(e) => handleChange("theme", e.target.value)}
      >
        {props.children}
      </select>
    </div>
  );
}
