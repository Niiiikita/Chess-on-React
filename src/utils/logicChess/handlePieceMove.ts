import { isCheckmate } from "./isCheckmate";
import { isStalemate } from "./isStalemate";
import { squareToCoords } from "../squareToCoords/squareToCoords";
import type {
  GameOverType,
  LastMoveType,
  PieceType,
  PromotionType,
} from "../typeBoard/types";

export default function handlePieceMove(
  e: React.DragEvent<HTMLDivElement>,
  board: PieceType[][],
  rowIdx: number,
  colIdx: number,
  setBoard: React.Dispatch<React.SetStateAction<PieceType[][]>>,
  setLastMove: React.Dispatch<React.SetStateAction<LastMoveType>>,
  setPromotion: React.Dispatch<React.SetStateAction<PromotionType>>,
  setGameOver: React.Dispatch<React.SetStateAction<GameOverType>>,
  setPossibleMove: React.Dispatch<React.SetStateAction<string[]>>
) {
  e.preventDefault();

  // Очищаем список возможных ходов
  setPossibleMove([]);

  const fromSquare = e.dataTransfer?.getData("from");
  if (!fromSquare) return;

  const [fromRow, fromCol] = squareToCoords(fromSquare);
  const movedPiece = board[fromRow][fromCol];
  if (!movedPiece) return;

  // Проверка: это пешка и она дошла до края?
  if (movedPiece.type === "pawn" && (rowIdx === 0 || rowIdx === 7)) {
    // Создаём новую доску, но НЕ обновляем её сразу
    const newBoard = board.map((row) => [...row]);
    newBoard[rowIdx][colIdx] = movedPiece; // временно ставим пешку
    setBoard(newBoard); // обновляем доску, чтобы пешка стояла

    newBoard[fromRow][fromCol] = null; // удаляем старую пешку

    // Устанавливаем состояние превращения
    setPromotion({
      row: rowIdx,
      col: colIdx,
      color: movedPiece.color,
    });

    // Не обновляем lastMove, selectedFrom и т.д. — это сделает PopupChoosingFigure
    return;
  }

  // Обычный ход
  const newBoard = board.map((row) => [...row]);
  newBoard[rowIdx][colIdx] = movedPiece;
  newBoard[fromRow][fromCol] = null;

  setBoard(newBoard);
  setLastMove({
    from: [fromRow, fromCol],
    to: [rowIdx, colIdx],
    piece: movedPiece,
  });

  const opponentColor = movedPiece.color === "white" ? "black" : "white";

  // После каждого хода проверяем на: мат или пат
  if (isCheckmate(newBoard, opponentColor)) {
    setGameOver("checkmate");
  } else if (isStalemate(newBoard, opponentColor)) {
    setGameOver("stalemate");
  }
}
