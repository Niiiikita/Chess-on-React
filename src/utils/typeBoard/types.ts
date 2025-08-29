import type { ReactElement } from "react";
import { ChessGameState } from "./ChessGameState";

export type GameModeType = "menu" | "vs-ai" | "local" | "online";

export type CurrentPlayerType = "white" | "black";

export type initialPiece = [
  "rook",
  "knight",
  "bishop",
  "queen",
  "king",
  "bishop",
  "knight",
  "rook"
];

export type PieceType = {
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"; // Фигуры: pawn - пешка, rook - ладья, knight - конь, bishop - слон, queen - королева, king - король
  color: "white" | "black"; // Цвет фигур: white - белый, black - черный
} | null;
export type Board = PieceType[][];

export type PieceSymbols = {
  white: {
    king: ReactElement;
    queen: ReactElement;
    rook: ReactElement;
    bishop: ReactElement;
    knight: ReactElement;
    pawn: ReactElement;
  };
  black: {
    king: ReactElement;
    queen: ReactElement;
    rook: ReactElement;
    bishop: ReactElement;
    knight: ReactElement;
    pawn: ReactElement;
  };
};

export type PieceProps = {
  piece: {
    type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
    color: "white" | "black";
  };
  coordsRow: number;
  coordsCol: number;
  context: ChessGameState;
};

export type LastMoveType = {
  from: [number, number];
  to: [number, number];
  piece: PieceType;
} | null;

export type PromotionType = {
  row: number;
  col: number;
  color: "white" | "black";
} | null;

export type SelectedFromType = {
  row: number;
  col: number;
} | null;

export type GameOverType = "checkmate" | "stalemate" | null;

export type HasKingMovedType = {
  white: boolean;
  black: boolean;
};

export type HasRookMovedType = {
  white: {
    left: boolean;
    right: boolean;
  };
  black: {
    left: boolean;
    right: boolean;
  };
};

export type CapturedPiecesType = {
  white: PieceType[];
  black: PieceType[];
};
