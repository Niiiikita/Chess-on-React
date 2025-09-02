import styles from "./Loader.module.css";

export function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <p>Загружаем...</p>
      <div className={styles.customLoader}></div>
    </div>
  );
}
