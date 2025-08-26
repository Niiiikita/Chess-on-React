import type { PieceSymbols } from "../../utils/typeBoard/types";

// Иконки черных фигур
import { BishopBlack } from "../ChessPiece/Black/BishopBlack";
import { KingBlack } from "../ChessPiece/Black/KingBlack";
import { KnightBlack } from "../ChessPiece/Black/KnightBlack";
import { PawnBlack } from "../ChessPiece/Black/PawnBlack";
import { QueenBlack } from "../ChessPiece/Black/QueenBlack";
import { RookBlack } from "../ChessPiece/Black/RookBlack";

// Иконки булых фигур
import { BishopWhite } from "../ChessPiece/White/BishopWhite";
import { KingWhite } from "../ChessPiece/White/KingWhite";
import { KnightWhite } from "../ChessPiece/White/KnightWhite";
import { PawnWhite } from "../ChessPiece/White/PawnWhite";
import { QueenWhite } from "../ChessPiece/White/QueenWhite";
import { RookWhite } from "../ChessPiece/White/RookWhite";

export const pieceSymbols: PieceSymbols = {
  white: {
    king: <KingWhite />,
    queen: <QueenWhite />,
    rook: <RookWhite />,
    bishop: <BishopWhite />,
    knight: <KnightWhite />,
    pawn: <PawnWhite />,
  },
  black: {
    king: <KingBlack />,
    queen: <QueenBlack />,
    rook: <RookBlack />,
    bishop: <BishopBlack />,
    knight: <KnightBlack />,
    pawn: <PawnBlack />,
  },
};
