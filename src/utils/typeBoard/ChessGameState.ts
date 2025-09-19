import type {
  Board,
  LastMoveType,
  PromotionType,
  GameOverType,
  HasKingMovedType,
  HasRookMovedType,
  SelectedFromType,
  GameModeType,
  CapturedPiecesType,
} from "@/utils/typeBoard/types";

export type ChessGameState = {
  board: Board;
  setBoard: React.Dispatch<React.SetStateAction<Board>>;
  lastMove: LastMoveType;
  setLastMove: React.Dispatch<React.SetStateAction<LastMoveType>>;
  selectedFrom: SelectedFromType;
  setSelectedFrom: React.Dispatch<React.SetStateAction<SelectedFromType>>;
  possibleMove: string[];
  setPossibleMove: React.Dispatch<React.SetStateAction<string[]>>;
  promotion: PromotionType;
  setPromotion: React.Dispatch<React.SetStateAction<PromotionType>>;
  gameOver: GameOverType;
  setGameOver: React.Dispatch<React.SetStateAction<GameOverType>>;
  hasKingMoved: HasKingMovedType;
  setHasKingMoved: React.Dispatch<React.SetStateAction<HasKingMovedType>>;
  hasRookMoved: HasRookMovedType;
  setHasRookMoved: React.Dispatch<React.SetStateAction<HasRookMovedType>>;
  currentPlayer: "white" | "black";
  setCurrentPlayer: React.Dispatch<React.SetStateAction<"white" | "black">>;
  hint: string | null;
  setHint: React.Dispatch<React.SetStateAction<string | null>>;
  gameState?: GameModeType;
  capturedPieces: CapturedPiecesType;
  setCapturedPieces: React.Dispatch<React.SetStateAction<CapturedPiecesType>>;
  highlightedSquare: string | null;
  setHighlightedSquare: React.Dispatch<React.SetStateAction<string | null>>;
  // ✅ Добавленные поля:
  gameId?: string | null;
  transmissionMove?: (
    from: string,
    to: string,
    gameId?: string,
    promotion?: "q" | "r" | "b" | "n"
  ) => void;
};
