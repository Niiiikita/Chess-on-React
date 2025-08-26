import type React from "react";
import type {
  GameMode,
  GameOverType,
  LastMoveType,
  PieceType,
  PromotionType,
  SelectedFromType,
} from "../../utils/typeBoard/types";
import { resetGame } from "../../utils/resetGame/resetGame";
import styles from "./GameOverModal.module.css";

export default function GameOverModal(props: {
  setBoard: React.Dispatch<React.SetStateAction<PieceType[][]>>;
  setLastMove: React.Dispatch<React.SetStateAction<LastMoveType>>;
  setPromotion: React.Dispatch<React.SetStateAction<PromotionType>>;
  setGameOver: React.Dispatch<React.SetStateAction<GameOverType>>;
  setPossibleMove: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedFrom: React.Dispatch<React.SetStateAction<SelectedFromType>>;
  gameOver: GameOverType;
  setGameState: React.Dispatch<React.SetStateAction<GameMode>>;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<"white" | "black">>;
  setHint: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <div className={styles.gameOverModal}>
      <div className={styles.gameOverOptions}>
        <h2>{props.gameOver === "checkmate" ? "Мат!" : "Пат!"}</h2>
        <button
          onClick={(e) =>
            resetGame(
              e,
              props.setBoard,
              props.setLastMove,
              props.setPromotion,
              props.setGameOver,
              props.setPossibleMove,
              props.setSelectedFrom,
              props.setCurrentPlayer,
              props.setHint
            )
          }
        >
          Новая игра
        </button>
        <button onClick={() => props.setGameState("menu")}>В меню</button>
      </div>
    </div>
  );
}
