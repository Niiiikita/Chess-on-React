// import type { ReactElement } from "react";

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
  [color in "white" | "black"]: {
    [type in
      | "king"
      | "queen"
      | "rook"
      | "bishop"
      | "knight"
      | "pawn"]: () => Promise<{
      default: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    }>;
  };
};

export type PieceProps = {
  piece: PieceType;
  isLastMoveFrom: boolean;
  isLastMoveTo: boolean;
  onDragStart: (e: React.DragEvent) => void;
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

export type Settings = {
  theme: "light" | "dark";
  highlightMoves: boolean;
  animations: boolean;
  sound: boolean;
  fullscreen: boolean;
};
