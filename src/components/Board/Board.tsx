import { Suspense } from "react";
import { useChessGame } from "@/hooks/useChessGame";
import { LazyPopupChoosingFigure } from "../PopupChoosingFigure/PopupChoosingFigure.lazy";
import { LazyGameOverModal } from "../GameOver/GameOverModal.lazy";
import Square from "../Square/Square";
import Hint from "../Hint/Hint";
import CurrentPlayerComponent from "../CurrentPlayerComponent/CurrentPlayerComponent";
import type { GameModeType } from "@/utils/typeBoard/types";
import { resetGame } from "@/utils/resetGame/resetGame";
import { handleClickPiece } from "@/utils/logicChess/handleClickPiece";
import styles from "./Board.module.css";

export default function Board({
  gameState,
  setGameState,
  transmissionMove,
  gameId,
  resign,
  game,
}: {
  gameState: GameModeType;
  setGameState: React.Dispatch<React.SetStateAction<GameModeType>>;
  transmissionMove?: (
    from: string,
    to: string,
    gameId?: string,
    promotion?: "q" | "r" | "b" | "n"
  ) => void;
  gameId?: string | null;
  resign?: (gameId: string) => void;
  game: ReturnType<typeof useChessGame>;
}) {
  const {
    board,
    setBoard,
    possibleMove,
    setPossibleMove,
    hint,
    setHint,
    currentPlayer,
    setCurrentPlayer,
    myColor,
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
  } = game;

  // 🚀 ДЕЛЕГИРУЕМ СОБЫТИЯ ИЗ Square В Board
  const handleSquareClick = (e: React.MouseEvent, row: number, col: number) => {
    const piece = board[row][col];
    handleClickPiece(e, piece, row, col, {
      ...game, // ← ВСЁ, ЧТО ЕСТЬ
      gameState, // ← ДОБАВЛЯЕМ gameState
      gameId, // ← ДОБАВЛЯЕМ gameId
      transmissionMove, // ← ДОБАВЛЯЕМ transmissionMove
    });
  };

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        <div className={styles.boardGame}>
          {board.map((row, rowIdx) =>
            row.map((piece, colIdx) => {
              const isLight = (rowIdx + colIdx) % 2 === 0;

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
                  gameState={gameState}
                  onClick={(e) => handleSquareClick(e, rowIdx, colIdx)}
                  gameId={gameId}
                />
              );
            })
          )}
        </div>
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

      {/* Модальное окно — ОДНО, поверх доски */}
      {promotion && (
        <Suspense fallback={null}>
          <LazyPopupChoosingFigure
            game={game}
            gameState={gameState}
            gameId={gameId ?? undefined}
            transmissionMove={transmissionMove}
          />
        </Suspense>
      )}

      {/* Индикатор текущего игрока */}
      <CurrentPlayerComponent
        gameId={gameId}
        resign={resign}
        currentPlayer={currentPlayer}
        gameState={gameState}
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
            game={game}
            gameId={gameId}
            gameState={gameState}
            setGameState={setGameState}
            currentPlayer={currentPlayer}
            myColor={myColor}
            resign={resign}
          />
        </Suspense>
      )}
    </div>
  );
}
