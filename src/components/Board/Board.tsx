import { Suspense } from "react";
import { useChessGame } from "@/hooks/useChessGame";
import { usePieceDrag } from "@/hooks/usePieceDrag";
import { LazyPopupChoosingFigure } from "../PopupChoosingFigure/PopupChoosingFigure.lazy";
import { LazyGameOverModal } from "../GameOver/GameOverModal.lazy";
import Square from "../Square/Square";
import Hint from "../Hint/Hint";
import CurrentPlayerComponent from "../CurrentPlayerComponent/CurrentPlayerComponent";
import type { GameModeType } from "@/utils/typeBoard/types";
import { resetGame } from "@/utils/resetGame/resetGame";
import styles from "./Board.module.css";

export default function Board({
  gameState,
  setGameState,
}: {
  gameState: GameModeType;
  setGameState: React.Dispatch<React.SetStateAction<GameModeType>>;
}) {
  const game = useChessGame();

  const {
    board,
    setBoard,
    possibleMove,
    setPossibleMove,
    hint,
    setHint,
    currentPlayer,
    setCurrentPlayer,
    promotion,
    setPromotion,
    lastMove,
    setLastMove,
    setSelectedFrom,
    gameOver,
    setGameOver,
    setHasKingMoved,
    setHasRookMoved,
    capturedPieces,
    setCapturedPieces,
    setHighlightedSquare,
  } = game;

  // Кастомный хук для перетаскивания фигуры
  const { handleDragStart } = usePieceDrag({
    board: game.board,
    lastMove: game.lastMove,
    hasKingMoved: game.hasKingMoved,
    hasRookMoved: game.hasRookMoved,
    currentPlayer: game.currentPlayer,
    setPossibleMove: game.setPossibleMove,
  });

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        <div className={styles.boardGame}>
          {board.map((row, rowIdx) =>
            row.map((piece, colIdx) => {
              const isLight = (rowIdx + colIdx) % 2 === 0;

              // Проверяем, была ли эта клетка частью последнего хода
              const isLastMoveFrom =
                lastMove &&
                lastMove.from[0] === rowIdx &&
                lastMove.from[1] === colIdx;

              const isLastMoveTo =
                lastMove &&
                lastMove.to[0] === rowIdx &&
                lastMove.to[1] === colIdx;

              return (
                <Square
                  key={`${rowIdx}-${colIdx}`}
                  piece={piece}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                  isLight={isLight}
                  isLastMoveFrom={!!isLastMoveFrom}
                  isLastMoveTo={!!isLastMoveTo}
                  possibleMove={possibleMove}
                  game={game}
                  gameState={gameState}
                  handleDragStart={handleDragStart}
                  setHighlightedSquare={setHighlightedSquare}
                />
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
        <Suspense fallback={null}>
          <LazyPopupChoosingFigure
            {...game}
            gameState={gameState}
          />
        </Suspense>
      )}

      {/* Индикатор текущего игрока */}
      <CurrentPlayerComponent
        currentPlayer={currentPlayer}
        setGameState={setGameState}
        capturedPieces={capturedPieces}
        resetGame={() =>
          resetGame({
            setBoard,
            setLastMove,
            setPromotion,
            setGameOver,
            setPossibleMove,
            setSelectedFrom,
            setCurrentPlayer,
            setHint,
            setHasKingMoved,
            setHasRookMoved,
            setCapturedPieces,
          })
        }
      />

      {gameOver && (
        <Suspense fallback={null}>
          <LazyGameOverModal
            {...game}
            setGameState={setGameState}
          />
        </Suspense>
      )}
    </div>
  );
}
