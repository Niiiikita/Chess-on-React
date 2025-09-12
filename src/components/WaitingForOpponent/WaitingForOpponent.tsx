import Button from "../Button/Button";
import styles from "./WaitingForOpponent.module.css";

export function WaitingForOpponent({
  gameId,
  onBack,
}: {
  gameId: string;
  onBack: () => void;
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
          <Button onClick={onBack}>← Назад</Button>
        </div>
      </div>
    </div>
  );
}
