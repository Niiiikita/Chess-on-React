import { QueenWhite } from "@/components/ChessPiece/White/QueenWhite";
import { QueenBlack } from "@/components/ChessPiece/Black/QueenBlack";
import clsx from "clsx";
import styles from "./CurrentPlayerComponent.module.css";
import Button from "../Button/Button";
import { GameMode } from "@/utils/typeBoard/types";

export default function CurrentPlayerComponent({
  currentPlayer,
  setGameState,
  resetGame,
  className,
}: {
  currentPlayer: "white" | "black";
  setGameState: React.Dispatch<React.SetStateAction<GameMode>>;
  resetGame: (e: React.MouseEvent<HTMLButtonElement>) => void; // ✅ Только event
  className?: string;
}) {
  return (
    <div className={clsx(styles.advanceContainer, className)}>
      <div className={clsx(styles.advanceContainerCurrentPlayer, className)}>
        {currentPlayer === "white" ? (
          <QueenWhite style={{ width: 30, height: 30 }} />
        ) : (
          <QueenBlack style={{ width: 30, height: 30 }} />
        )}
        <div className={clsx(styles.advanceContainerDescription, className)}>
          <span>Ход: </span>
          <span
            style={{
              color: currentPlayer === "white" ? "white" : "chocolate",
            }}
          >
            {currentPlayer === "white" ? "Белых" : "Чёрных"}
          </span>
        </div>
      </div>
      <Button
        className={clsx(styles.advanceContainerNewGame)}
        onClick={() => setGameState("menu")}
      >
        Меню
      </Button>
      <Button
        className={styles.advanceContainerReset}
        onClick={resetGame}
      >
        Новая игра
      </Button>
    </div>
  );
}
