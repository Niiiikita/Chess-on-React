import { Suspense, useRef, useState } from "react";
import { useChessGame } from "@/hooks/useChessGame";
import { LazyPopupChoosingFigure } from "../PopupChoosingFigure/PopupChoosingFigure.lazy";
import { LazyGameOverModal } from "../GameOver/GameOverModal.lazy";
import Square from "../Square/Square";
import Hint from "../Hint/Hint";
import CurrentPlayerComponent from "../CurrentPlayerComponent/CurrentPlayerComponent";
import type { GameModeType, PieceType } from "@/utils/typeBoard/types";
import { resetGame } from "@/utils/resetGame/resetGame";
import { handleClickPiece } from "@/utils/logicChess/handleClickPiece";
import styles from "./Board.module.css";
import MovingPiece from "../Piece/MovingPiece";
import { useSettings } from "@/hooks/useSettings";

export default function Board({
  gameState,
  setGameState,
  transmissionMove,
  gameId,
  resign,
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
}) {
  const { settings } = useSettings();
  const boardRef = useRef<HTMLDivElement>(null);
  const [movingPiece, setMovingPiece] = useState<{
    piece: PieceType;
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
  } | null>(null);
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

  // ДЕЛЕГИРУЕМ СОБЫТИЯ ИЗ Square В Board
  const handleSquareClick = (e: React.MouseEvent, row: number, col: number) => {
    const piece = board[row][col];
    handleClickPiece(e, piece, row, col, {
      ...game,
      settings,
      gameState,
      gameId,
      transmissionMove,
      setMovingPiece,
      boardRef,
    });
    console.log("Клик");
  };

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        <div
          ref={boardRef}
          className={styles.boardGame}
          style={{
            position: "relative",
            overflow: "hidden",
            transform: "translateZ(0)",
          }}
        >
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

              // Если сейчас анимируется эта фигура, не показываем её в статичной позиции
              const isMovingPiece =
                movingPiece &&
                movingPiece.fromRow === rowIdx &&
                movingPiece.fromCol === colIdx;

              return (
                <Square
                  key={`${rowIdx}-${colIdx}`}
                  piece={isMovingPiece ? null : piece} // Скрываем фигуру во время анимации
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                  isLight={isLight}
                  isLastMoveFrom={!!isLastMoveFrom}
                  isLastMoveTo={!!isLastMoveTo}
                  possibleMove={possibleMove}
                  gameState={gameState}
                  onClick={(e) => handleSquareClick(e, rowIdx, colIdx)}
                />
              );
            })
          )}
          {/* Отдельно рендерим анимируемую фигуру */}
          {movingPiece && boardRef.current && (
            <MovingPiece
              piece={movingPiece.piece}
              fromRow={movingPiece.fromRow}
              fromCol={movingPiece.fromCol}
              toRow={movingPiece.toRow}
              toCol={movingPiece.toCol}
              boardElement={boardRef.current}
              onMoveComplete={() => {
                setMovingPiece(null);
              }}
            />
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
