import { squareToCoords } from "../squareToCoords/squareToCoords";
import { ChessGameState } from "../typeBoard/ChessGameState";
import { coordsToSquare } from "../coordsToSquare/coordsToSquare";
import { makeMove } from "./makeMove";

/**
 * Обрабатывает перемещение шахматной фигуры на доске.
 * Эта функция вызывается, когда фигура перетаскивается и отпускается на новой позиции.
 * Выполняются различные проверки, такие как валидация хода, проверка очередности хода,
 * обработка превращения пешки, а также проверка на мат или пат.
 * @param e Событие перетаскивания, возникающее при отпускании фигуры.
 * @param rowIdx Индекс строки целевой клетки.
 * @param colIdx Индекс столбца целевой клетки.
 * @param context Контекст игры, содержащий доску, игроков, ходы и др.
 */
export default function handlePieceMove(
  e: React.DragEvent,
  rowIdx: number,
  colIdx: number,
  context: ChessGameState
) {
  const {
    board,
    currentPlayer,
    // setCurrentPlayer,
    possibleMove,
    setBoard,
    // setLastMove,
    setPromotion,
    // setGameOver,
    setPossibleMove,
    setHint,
    gameOver,
    promotion,
  } = context;

  e.preventDefault();

  // 1. Если есть активное превращение, нельзя ходить
  if (promotion) return;

  // 2. Если игра окончена, нельзя ходить
  if (gameOver) return;

  // 3. Получаем, откуда началось перетаскивание
  const fromSquare = e.dataTransfer?.getData("from");
  if (!fromSquare) return;

  const [fromRow, fromCol] = squareToCoords(fromSquare);
  const movedPiece = board[fromRow][fromCol];
  if (!movedPiece) return;

  // 4. Проверяем, ходит ли текущий игрок?
  if (movedPiece.color !== currentPlayer) {
    setHint(`Сейчас ход ${currentPlayer === "white" ? "белых" : "чёрных"}!`);
    setTimeout(() => setHint(null), 1500);
    return;
  }

  // 5. Проверяем, можно ли ходить?
  const toSquare = coordsToSquare(rowIdx, colIdx);
  if (!possibleMove.includes(toSquare)) {
    setHint("Нельзя походить на это поле!");
    setTimeout(() => setHint(null), 1500);
    return;
  }

  // 6. Очищаем возможные ходы
  setPossibleMove([]);

  // 7. Проверяем, пешка дошла до края
  if (movedPiece.type === "pawn" && (rowIdx === 0 || rowIdx === 7)) {
    const newBoard = board.map((row) => [...row]);
    newBoard[rowIdx][colIdx] = movedPiece;
    setBoard(newBoard);

    newBoard[fromRow][fromCol] = null;

    // Устанавливаем превращение
    setPromotion({
      row: rowIdx,
      col: colIdx,
      color: movedPiece.color,
    });

    return;
  }

  makeMove(
    { row: fromRow, col: fromCol },
    { row: rowIdx, col: colIdx },
    context
  );

  // // 8. Обычный ход
  // const newBoard = board.map((r) => [...r]);
  // newBoard[rowIdx][colIdx] = movedPiece;
  // newBoard[fromRow][fromCol] = null;

  // setBoard(newBoard);
  // setLastMove({
  //   from: [fromRow, fromCol],
  //   to: [rowIdx, colIdx],
  //   piece: movedPiece,
  // });

  // setCurrentPlayer(movedPiece.color === "white" ? "black" : "white");

  // // === 9. ПРОВЕРКА МАТА/ПАТА ===
  // const opponentColor = movedPiece.color === "white" ? "black" : "white";
  // if (isCheckmate(newBoard, opponentColor)) {
  //   setGameOver("checkmate");
  // } else if (isStalemate(newBoard, opponentColor)) {
  //   setGameOver("stalemate");
  // }
}
