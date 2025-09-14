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
import handlePieceMove from "@/utils/logicChess/handlePieceMove";
import { coordsToSquare } from "@/utils/coordsToSquare/coordsToSquare";
import { handlePieceEnter } from "@/utils/logicChess/handlePieceEnter";
import { handleClickPiece } from "@/utils/logicChess/handleClickPiece";
import styles from "./Board.module.css";

export default function Board({
  gameState,
  setGameState,
  transmissionMove,
  gameId,
  game,
}: {
  gameState: GameModeType;
  setGameState: React.Dispatch<React.SetStateAction<GameModeType>>;
  transmissionMove?: (from: string, to: string, gameId?: string) => void;
  gameId?: string | null;
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

  // 🚀 ДЕЛЕГИРУЕМ СОБЫТИЯ ИЗ Square В Board
  const handleSquareClick = (e: React.MouseEvent, row: number, col: number) => {
    const piece = board[row][col];
    handleClickPiece(e, piece, row, col, {
      ...game,
      gameState,
      gameId,
      transmissionMove,
    });
  };

  const handleSquareDragStart = (
    e: React.DragEvent,
    row: number,
    col: number
  ) => {
    handleDragStart(e, row, col);
  };

  const handleSquareDragEnter = (
    e: React.DragEvent,
    row: number,
    col: number
  ) => {
    handlePieceEnter(
      e,
      row,
      col,
      possibleMove,
      currentPlayer,
      setHighlightedSquare
    );
  };

  const handleSquareDragLeave = () => {
    setHighlightedSquare(null);
  };

  const handleSquareDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSquareDrop = (e: React.DragEvent, row: number, col: number) => {
    const fromSquare = game.selectedFrom
      ? coordsToSquare(game.selectedFrom.row, game.selectedFrom.col)
      : null;

    if (!fromSquare) return;

    handlePieceMove(e, row, col, { ...game, gameState });

    setHighlightedSquare(null);
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
                  onDragStart={handleSquareDragStart}
                  onDragEnter={(e) => handleSquareDragEnter(e, rowIdx, colIdx)}
                  onDragLeave={handleSquareDragLeave}
                  onDragOver={handleSquareDragOver}
                  onDrop={(e) => handleSquareDrop(e, rowIdx, colIdx)}
                  onClick={(e) => handleSquareClick(e, rowIdx, colIdx)}
                  setHighlightedSquare={setHighlightedSquare}
                  transmissionMove={transmissionMove}
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
            {...game}
            gameState={gameState}
          />
        </Suspense>
      )}

      {/* Индикатор текущего игрока */}
      <CurrentPlayerComponent
        gameId={gameId}
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
            {...game}
            setGameState={setGameState}
          />
        </Suspense>
      )}
    </div>
  );
}
