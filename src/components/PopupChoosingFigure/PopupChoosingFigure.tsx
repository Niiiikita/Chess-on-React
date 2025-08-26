import { BishopBlack } from "../ChessPiece/Black/BishopBlack";
import { KnightBlack } from "../ChessPiece/Black/KnightBlack";
import { QueenBlack } from "../ChessPiece/Black/QueenBlack";
import { RookBlack } from "../ChessPiece/Black/RookBlack";
import { BishopWhite } from "../ChessPiece/White/BishopWhite";
import { KnightWhite } from "../ChessPiece/White/KnightWhite";
import { QueenWhite } from "../ChessPiece/White/QueenWhite";
import { RookWhite } from "../ChessPiece/White/RookWhite";
import type {
  LastMoveType,
  PieceType,
  PromotionType,
  SelectedFromType,
} from "../../utils/typeBoard/types";
import Button from "../Button/Button";
import styles from "./PopupChoosingFigure.module.css";

const pieceToRussian: Record<
  "queen" | "rook" | "bishop" | "knight" | "pawn" | "king",
  string
> = {
  queen: "Королева",
  rook: "Ладья",
  bishop: "Слон",
  knight: "Конь",
  pawn: "Пешка",
  king: "Король",
};

const pieceIconMap: Record<string, React.ReactNode> = {
  queen_white: <QueenWhite className={styles.popupPieceIcon} />,
  queen_black: <QueenBlack className={styles.popupPieceIcon} />,
  rook_white: <RookWhite className={styles.popupPieceIcon} />,
  rook_black: <RookBlack className={styles.popupPieceIcon} />,
  bishop_white: <BishopWhite className={styles.popupPieceIcon} />,
  bishop_black: <BishopBlack className={styles.popupPieceIcon} />,
  knight_white: <KnightWhite className={styles.popupPieceIcon} />,
  knight_black: <KnightBlack className={styles.popupPieceIcon} />,
};

export default function PopupChoosingFigure({
  promotion,
  board,
  setBoard,
  setPromotion,
  setLastMove,
  setSelectedFrom,
  setPossibleMove,
}: {
  promotion: PromotionType;
  board: PieceType[][];
  setBoard: React.Dispatch<React.SetStateAction<PieceType[][]>>;
  setPromotion: React.Dispatch<React.SetStateAction<PromotionType>>;
  setLastMove: React.Dispatch<React.SetStateAction<LastMoveType>>;
  setSelectedFrom: React.Dispatch<React.SetStateAction<SelectedFromType>>;
  setPossibleMove: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <div className={styles.promotionModal}>
      <h2>Выберите фигуру</h2>
      <div className={styles.promotionOptions}>
        {(["queen", "rook", "bishop", "knight"] as const).map((figure) => (
          <Button
            className={styles.promotionButton}
            key={figure}
            onClick={() => {
              // если есть превращение, то меняем фигуру
              if (promotion) {
                // создаем новую фигуру
                const newPiece: PieceType = {
                  type: figure,
                  color: promotion.color,
                };
                // обновляем доску
                const updatedBoard = board.map((row) => [...row]);
                // меняем фигуру на новую
                updatedBoard[promotion.row][promotion.col] = newPiece;

                // console.log(
                //   "Изначальная фигура",
                //   board[promotion.row][promotion.col]
                // );

                // console.log(
                //   "Изначальная фигура",
                //   updatedBoard[promotion.row][promotion.col]
                // );

                setBoard(updatedBoard);
                setLastMove({
                  from: [promotion.row, promotion.col],
                  to: [promotion.row, promotion.col],
                  piece: newPiece,
                });
                setSelectedFrom(null);
                setPossibleMove([]);
                setPromotion(null);
              }
            }}
          >
            {pieceIconMap[`${figure}_${promotion?.color}`]}
            {pieceToRussian[figure]}
          </Button>
        ))}
      </div>
    </div>
  );
}
