import { makeAIMove } from "../makeAIMove/makeAIMove";
import type {
  Board,
  GameMode,
  HasKingMovedType,
  HasRookMovedType,
  LastMoveType,
  PieceType,
} from "../typeBoard/types";
import { isCheckmate } from "./isCheckmate";
import { isStalemate } from "./isStalemate";

export function makeMove(
  from: { row: number; col: number },
  to: { row: number; col: number },
  board: Board,
  setBoard: React.Dispatch<React.SetStateAction<PieceType[][]>>,
  // lastMove: LastMoveType,
  setLastMove: React.Dispatch<React.SetStateAction<LastMoveType>>,
  setSelectedFrom: React.Dispatch<
    React.SetStateAction<{ row: number; col: number } | null>
  >,
  setPossibleMove: React.Dispatch<React.SetStateAction<string[]>>,
  setPromotion: React.Dispatch<
    React.SetStateAction<{
      row: number;
      col: number;
      color: "white" | "black";
    } | null>
  >,
  setGameOver: React.Dispatch<
    React.SetStateAction<"checkmate" | "stalemate" | null>
  >,
  setHasKingMoved: React.Dispatch<React.SetStateAction<HasKingMovedType>>,
  setHasRookMoved: React.Dispatch<React.SetStateAction<HasRookMovedType>>,
  currentPlayer: "white" | "black",
  setCurrentPlayer: React.Dispatch<React.SetStateAction<"white" | "black">>,
  gameState?: GameMode
) {
  // Копируем доску для изменения
  const newBoard = board.map((row) => [...row]);
  // Получаем фигуру
  const piece = newBoard[from.row][from.col];

  console.log("Фигура, которой сделали ход:", piece);
  // console.log("Сделан ход со строки:", from.row, "и со столбца:", from.col);
  // console.log("Сделан ход на строку:", to.row, "и на столбец:", to.col);

  if (!piece) return;

  // Проверяем, если это пешка и если она дошла до края
  if (piece.type === "pawn" && (to.row === 0 || to.row === 7)) {
    // Ставим пешку на новое место
    newBoard[to.row][to.col] = piece;
    setBoard(newBoard);

    // Запускаем превращение
    setPromotion({
      row: to.row,
      col: to.col,
      color: piece.color,
    });

    // Удаляем пешку со старого места
    newBoard[from.row][from.col] = null;
    setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
    setBoard(newBoard);

    if (gameState === "vs-ai" && piece.color === "white") {
      setTimeout(() => {
        makeAIMove(
          "black", // ✅ Текущий игрок — чёрный
          newBoard, // ✅ Актуальная доска
          {
            // ✅ Актуальный lastMove
            from: [from.row, from.col],
            to: [to.row, to.col],
            piece: piece,
          },
          setBoard,
          setLastMove,
          setSelectedFrom,
          setPossibleMove,
          setPromotion,
          setGameOver,
          setCurrentPlayer,
          setHasKingMoved,
          setHasRookMoved
        );
      }, 600);
    }

    return; // не обновляем lastMove и т.д. — это сделает PopupChoosingFigure
  }

  // Определяем, если это "Взятие на проходе"
  const isEnPassant =
    piece.type === "pawn" &&
    Math.abs(from.col - to.col) === 1 && // диагональ
    newBoard[to.row][to.col] === null; // поле пустое

  // 1. Все изменения доски
  // Обычный ход
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;

  if (isEnPassant) {
    newBoard[from.row][to.col] = null;
  }

  // Рокировка
  if (piece.type === "king" && Math.abs(from.col - to.col) === 2) {
    const rookFromCol = to.col === 6 ? 7 : 0;
    const rookToCol = to.col === 6 ? 5 : 3;

    newBoard[to.row][rookToCol] = newBoard[to.row][rookFromCol];
    newBoard[to.row][rookFromCol] = null;
  }

  // 2. Только после всех изменений — обновляем состояние
  setBoard(newBoard);
  setLastMove({
    from: [from.row, from.col],
    to: [to.row, to.col],
    piece: piece,
  });

  setPossibleMove([]);
  setSelectedFrom(null);

  // Проверка мата/пата
  const opponentColor = piece.color === "white" ? "black" : "white";
  if (isCheckmate(newBoard, opponentColor)) {
    setGameOver("checkmate");
  } else if (isStalemate(newBoard, opponentColor)) {
    setGameOver("stalemate");
  }

  // Обновление состояния движения
  if (piece.type === "king") {
    setHasKingMoved((prev) => ({ ...prev, [piece.color]: true }));
  }

  if (piece.type === "rook") {
    const side = piece.color;
    const position = from.col === 0 ? "left" : "right";
    setHasRookMoved((prev) => ({
      ...prev,
      [side]: { ...prev[side], [position]: true },
    }));
  }

  setCurrentPlayer(currentPlayer === "white" ? "black" : "white");

  // ✅ Только после ВСЕХ изменений — вызываем бота
  if (gameState === "vs-ai" && piece.color === "white") {
    setTimeout(() => {
      makeAIMove(
        "black", // ✅ Текущий игрок — чёрный
        newBoard, // ✅ Актуальная доска
        {
          // ✅ Актуальный lastMove
          from: [from.row, from.col],
          to: [to.row, to.col],
          piece: piece,
        },
        setBoard,
        setLastMove,
        setSelectedFrom,
        setPossibleMove,
        setPromotion,
        setGameOver,
        setCurrentPlayer,
        setHasKingMoved,
        setHasRookMoved
      );
    }, 600);
  }
}
