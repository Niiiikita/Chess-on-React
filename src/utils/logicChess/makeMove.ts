import { makeAIMove } from "../makeAIMove/makeAIMove";
import { ChessGameState } from "../typeBoard/ChessGameState";
import type { GameModeType, PieceType } from "../typeBoard/types";
import { isCheckmate } from "./isCheckmate";
import { isStalemate } from "./isStalemate";

/**
 * Выполняет ход шахматной фигуры с одной позиции на другую на доске.
 * Обрабатывает специальные ходы, такие как превращение пешки, взятие на проходе и рокировка.
 * Обновляет состояние игры, включая состояние доски, текущего игрока и условия окончания игры.
 * Если режим игры — "vs-ai" и текущий игрок — белые, запускает ход искусственного интеллекта.
 * @param from — Начальная позиция фигуры, с индексами строки и столбца.
 * @param to — Целевая позиция для перемещения фигуры, с индексами строки и столбца.
 * @param context — Текущее состояние игры и функции для обновления состояния.
 */
export function makeMove(
  from: { row: number; col: number },
  to: { row: number; col: number },
  context: ChessGameState & { gameState?: GameModeType }
) {
  const {
    board,
    setBoard,
    setLastMove,
    setSelectedFrom,
    setPossibleMove,
    setPromotion,
    setGameOver,
    setHasKingMoved,
    setHasRookMoved,
    currentPlayer,
    setCurrentPlayer,
    setCapturedPieces,
    gameState,
    gameId,
    transmissionMove,
  } = context;

  const newBoard = board.map((row) => [...row]);
  const piece = newBoard[from.row][from.col];

  // === 1. Проверка, превращение пешки ===
  if (piece?.type === "pawn" && (to.row === 0 || to.row === 7)) {
    const capturedPiece = newBoard[to.row][to.col];

    // Добавляем в capturedPieces, если есть взятие
    if (capturedPiece) {
      setCapturedPieces((prev) => ({
        ...prev,
        [capturedPiece.color]: [...prev[capturedPiece.color], capturedPiece],
      }));
    }
    newBoard[to.row][to.col] = piece;
    setBoard(newBoard);

    setPromotion({
      fromRow: from.row,
      fromCol: from.col,
      toRow: to.row,
      toCol: to.col,
      color: piece.color,
    });

    newBoard[from.row][from.col] = null;
    setBoard(newBoard);

    return;
  }

  // === 2. "Взятие на проходе" (пешкой) ===
  const isEnPassant =
    piece?.type === "pawn" &&
    Math.abs(from.col - to.col) === 1 &&
    newBoard[to.row][to.col] === null;

  let capturedPiece: PieceType | null = null;

  if (isEnPassant) {
    const capturedRow = from.row;
    const capturedCol = to.col;
    capturedPiece = newBoard[capturedRow][capturedCol];
    newBoard[capturedRow][capturedCol] = null;
  } else {
    // Обычное взятие
    capturedPiece = newBoard[to.row][to.col];
  }

  // === 3. Добавляем в capturedPieces, если была взята фигура ===
  if (capturedPiece) {
    setCapturedPieces((prev) => ({
      ...prev,
      [capturedPiece!.color]: [...prev[capturedPiece!.color], capturedPiece!],
    }));
  }

  // === 4. Выполняем ход ===
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;

  // === 5. Рокировка ===
  if (piece?.type === "king" && Math.abs(from.col - to.col) === 2) {
    const rookFromCol = to.col === 6 ? 7 : 0;
    const rookToCol = to.col === 6 ? 5 : 3;
    newBoard[to.row][rookToCol] = newBoard[to.row][rookFromCol];
    newBoard[to.row][rookFromCol] = null;
  }

  setBoard(newBoard);
  setLastMove({
    from: [from.row, from.col],
    to: [to.row, to.col],
    piece: piece,
  });

  setPossibleMove([]);
  setSelectedFrom(null);

  // === 6. Проверка на мат/пат ===
  const opponentColor = piece?.color === "white" ? "black" : "white";
  if (isCheckmate(newBoard, opponentColor)) {
    setGameOver("checkmate");
  } else if (isStalemate(newBoard, opponentColor)) {
    setGameOver("stalemate");
  }

  // === 7. Обновление состояния фигур ===
  if (piece?.type === "king") {
    setHasKingMoved((prev) => ({ ...prev, [piece.color]: true }));
  }

  if (piece?.type === "rook") {
    const side = piece.color;
    const position = from.col === 0 ? "left" : "right";
    setHasRookMoved((prev) => ({
      ...prev,
      [side]: { ...prev[side], [position]: true },
    }));
  }

  // === 8. Меняем ход ===
  setCurrentPlayer(currentPlayer === "white" ? "black" : "white");

  // === 9. Бот, если режим "vs-ai" и ходил белый, он отвечает ===
  if (gameState === "vs-ai" && piece?.color === "white") {
    setTimeout(() => {
      makeAIMove({
        ...context,
        board: newBoard,
        lastMove: { from: [from.row, from.col], to: [to.row, to.col], piece },
        currentPlayer: "black",
        gameState: "vs-ai",
      });
    }, 800);
  }

  // КЛЮЧЕВОЙ ШАГ: ОТПРАВКА ХОДА НА СЕРВЕР — ЕСЛИ ЭТО ОНЛАЙН И НЕ ПРЕВРАЩЕНИЕ
  if (
    gameState?.startsWith("online-") &&
    gameId &&
    transmissionMove &&
    !(piece?.type === "pawn" && (to.row === 0 || to.row === 7))
  ) {
    const fromSquare = `${String.fromCharCode(97 + from.col)}${8 - from.row}`;
    const toSquare = `${String.fromCharCode(97 + to.col)}${8 - to.row}`;

    transmissionMove(fromSquare, toSquare, gameId);
  }
}
