import Piece from "../Piece/Piece";
import PopupChoosingFigure from "../PopupChoosingFigure/PopupChoosingFigure";
import GameOverModal from "../GameOver/GameOverModal";
import Hint from "../Hint/Hint";
import CurrentPlayerComponent from "../CurrentPlayerComponent/CurrentPlayerComponent";
import handlePieceMove from "@/utils/logicChess/handlePieceMove";
import { handleClickPiece } from "@/utils/logicChess/handleClickPiece";
import { coordsToSquare } from "@/utils/coordsToSquare/coordsToSquare";
import type { GameModeType } from "@/utils/typeBoard/types";
import { resetGame } from "@/utils/resetGame/resetGame";
import { useChessGame } from "@/hooks/useChessGame";
import clsx from "clsx";
import styles from "./Board.module.css";
import { handlePieceEnter } from "@/utils/logicChess/handlePieceEnter";

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

              // Проверяем, была ли эта клетка частью последнего хода
              const isLastMoveFrom =
                lastMove &&
                lastMove.from[0] === rowIdx &&
                lastMove.from[1] === colIdx;

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={clsx(
                    styles.square,
                    `${isLastMoveFrom ? styles.lastMoveFrom : ""}`
                  )}
                  style={{ backgroundColor: squareColor }}
                  onDragEnter={(e) =>
                    handlePieceEnter(
                      e,
                      rowIdx,
                      colIdx,
                      possibleMove,
                      currentPlayer,
                      setHighlightedSquare
                    )
                  }
                  onDragLeave={() => setHighlightedSquare(null)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    handlePieceMove(e, rowIdx, colIdx, {
                      ...game,
                      gameState,
                    });
                    setHighlightedSquare(null); // сброс после drop
                  }}
                  onClick={(e) => {
                    handleClickPiece(e, piece, rowIdx, colIdx, {
                      ...game,
                      gameState,
                    });
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
                      context={game}
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
          gameState={gameState}
          {...game}
        />
      )}

      {/* Индикатор текущего игрока */}
      <CurrentPlayerComponent
        currentPlayer={currentPlayer}
        setGameState={setGameState}
        capturedPieces={capturedPieces}
        resetGame={() =>
          resetGame(
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
            setCapturedPieces
          )
        }
      />

      {gameOver && (
        <GameOverModal
          setGameState={setGameState}
          {...game}
        />
      )}
    </div>
  );
}
