import React from "react";
import { isTMA } from "@telegram-apps/bridge";
import { viewport } from "@telegram-apps/sdk";
import { Settings } from "@/utils/typeBoard/types";
import styles from "./SettingItemInput.module.css";

export default function SettingsItemInput(props: {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  name: string;
  id: string;
}) {
  const handleChange = (key: keyof Settings, value: boolean | string) => {
    props.setSettings((prev) => ({ ...prev, [key]: value }));

    if (isTMA()) {
      if (viewport.requestFullscreen.isAvailable()) {
        const fullscreenOpen = async () => await viewport.requestFullscreen();
        fullscreenOpen();
      } else if (viewport.exitFullscreen.isAvailable()) {
        const fullscreenClose = async () => await viewport.exitFullscreen();
        fullscreenClose();
      }
    }

    console.log(props.id);
  };

  return (
    <div className={styles.settingItem}>
      <span>{props.name}</span>
      <div className={styles.flipswitch}>
        <input
          className={styles.flipswitchCb}
          id={props.id}
          type="checkbox"
          checked={props.settings[props.id as keyof Settings] as boolean}
          onChange={(e) =>
            handleChange(props.id as keyof Settings, e.target.checked)
          }
        />
        <label
          htmlFor={props.id}
          className={styles.flipswitchLabel}
        >
          <div className={styles.flipswitchInner}></div>
          <div className={styles.flipswitchSwitch}></div>
        </label>
      </div>
    </div>
  );
}
