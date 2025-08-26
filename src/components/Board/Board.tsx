import { useState } from "react";
import Piece from "../Piece/Piece";
import handlePieceMove from "../../utils/logicChess/handlePieceMove";
import PopupChoosingFigure from "../PopupChoosingFigure/PopupChoosingFigure";
import GameOverModal from "../GameOver/GameOverModal";
import Hint from "../Hint/Hint";
import CurrentPlayerComponent from "../CurrentPlayerComponent/CurrentPlayerComponent";
import { setupInitialBoard } from "../../utils/setupInitialBoard/setupInitialBoard";
import { handleClickPiece } from "../../utils/logicChess/handleClickPiece";
import { coordsToSquare } from "../../utils/coordsToSquare/coordsToSquare";
import type {
  CurrentPlayerType,
  GameMode,
  GameOverType,
  HasKingMovedType,
  HasRookMovedType,
  LastMoveType,
  PromotionType,
  SelectedFromType,
} from "../../utils/typeBoard/types";
import { resetGame } from "../../utils/resetGame/resetGame";
import styles from "./Board.module.css";

export default function Board({
  gameState,
  setGameState,
}: {
  gameState: GameMode;
  setGameState: React.Dispatch<React.SetStateAction<GameMode>>;
}) {
  // Состояние текущего игрока
  const [currentPlayer, setCurrentPlayer] =
    useState<CurrentPlayerType>("white");
  // Состояние игрового поля
  const [board, setBoard] = useState(setupInitialBoard());
  // Состояние возможных ходов
  const [possibleMove, setPossibleMove] = useState<string[]>([]);
  // Состояние выбранной фигуры
  const [selectedFrom, setSelectedFrom] = useState<SelectedFromType>(null);
  // Состояние последнего хода
  const [lastMove, setLastMove] = useState<LastMoveType>(null);
  // Состояние превращения
  const [promotion, setPromotion] = useState<PromotionType>(null);
  // Состояние окончания игры
  const [gameOver, setGameOver] = useState<GameOverType>(null);
  // Состояние перемещения короля
  const [hasKingMoved, setHasKingMoved] = useState<HasKingMovedType>({
    white: false,
    black: false,
  });
  // Состояние перемещения ладьи
  const [hasRookMoved, setHasRookMoved] = useState<HasRookMovedType>({
    white: { left: false, right: false },
    black: { left: false, right: false },
  });

  // Состояние подсказки
  const [hint, setHint] = useState<string | null>(null);

  // console.log("Состояние выбранной фигуры:", selectedFrom);
  // console.log("Состояние последнего хода:", lastMove);
  // console.log("Состояние игрока", currentPlayer);

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        <div className={styles.boardGame}>
          {board.map((row, rowIdx) =>
            row.map((piece, colIdx) => {
              const isLight = (rowIdx + colIdx) % 2 === 0;
              const squareColor = isLight ? "#f0d9b5" : "#b58863";
              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={styles.square}
                  style={{ backgroundColor: squareColor }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    handlePieceMove(
                      e,
                      board,
                      rowIdx,
                      colIdx,
                      setBoard,
                      setLastMove,
                      setPromotion,
                      setGameOver,
                      setPossibleMove
                    );
                  }}
                  onClick={(e) => {
                    handleClickPiece(
                      e,
                      piece,
                      rowIdx,
                      colIdx,
                      possibleMove,
                      setPossibleMove,
                      board,
                      lastMove,
                      selectedFrom,
                      setSelectedFrom,
                      setBoard,
                      setLastMove,
                      setPromotion,
                      setGameOver,
                      setHasKingMoved,
                      setHasRookMoved,
                      hasKingMoved,
                      hasRookMoved,
                      currentPlayer,
                      setCurrentPlayer,
                      setHint,
                      gameState
                    );
                  }}
                >
                  {possibleMove.includes(coordsToSquare(rowIdx, colIdx)) && (
                    <div className={styles.move} />
                  )}

                  {piece && (
                    <Piece
                      piece={piece}
                      coordsRow={rowIdx}
                      coordsCol={colIdx}
                      setPossibleMove={setPossibleMove}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Подсказка */}
        {hint && (
          <Hint
            style={{
              background: currentPlayer === "white" ? "#fff" : "#000",
              color: currentPlayer === "white" ? "#000" : "#fff",
            }}
          >
            {hint}
          </Hint>
        )}
      </div>

      {/* Модальное окно — ОДНО, поверх доски */}
      {promotion && (
        <PopupChoosingFigure
          promotion={promotion}
          board={board}
          setBoard={setBoard}
          setPromotion={setPromotion}
          setLastMove={setLastMove}
          setSelectedFrom={setSelectedFrom}
          setPossibleMove={setPossibleMove}
        />
      )}

      {/* Индикатор текущего игрока */}
      <CurrentPlayerComponent
        currentPlayer={currentPlayer}
        setGameState={setGameState}
        resetGame={resetGame}
        className={styles.currentPlayer}
      />

      {gameOver && (
        <GameOverModal
          setBoard={setBoard}
          setLastMove={setLastMove}
          setPromotion={setPromotion}
          setGameOver={setGameOver}
          setPossibleMove={setPossibleMove}
          setSelectedFrom={setSelectedFrom}
          gameOver={gameOver}
          setGameState={setGameState}
          setCurrentPlayer={setCurrentPlayer}
          setHint={setHint}
        />
      )}
    </div>
  );
}
