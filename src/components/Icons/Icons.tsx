import type { PieceSymbols } from "../../utils/typeBoard/types";

export const pieceSymbols: PieceSymbols = {
  white: {
    king: () => import("../ChessPiece/White/KingWhite"),
    queen: () => import("../ChessPiece/White/QueenWhite"),
    rook: () => import("../ChessPiece/White/RookWhite"),
    bishop: () => import("../ChessPiece/White/BishopWhite"),
    knight: () => import("../ChessPiece/White/KnightWhite"),
    pawn: () => import("../ChessPiece/White/PawnWhite"),
  },
  black: {
    king: () => import("../ChessPiece/Black/KingBlack"),
    queen: () => import("../ChessPiece/Black/QueenBlack"),
    rook: () => import("../ChessPiece/Black/RookBlack"),
    bishop: () => import("../ChessPiece/Black/BishopBlack"),
    knight: () => import("../ChessPiece/Black/KnightBlack"),
    pawn: () => import("../ChessPiece/Black/PawnBlack"),
  },
};
