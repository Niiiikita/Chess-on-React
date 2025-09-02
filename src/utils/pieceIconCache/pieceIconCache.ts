import QueenWhite from "@/components/ChessPiece/White/QueenWhite";
import QueenBlack from "@/components/ChessPiece/Black/QueenBlack";
import RookWhite from "@/components/ChessPiece/White/RookWhite";
import RookBlack from "@/components/ChessPiece/Black/RookBlack";
import BishopWhite from "@/components/ChessPiece/White/BishopWhite";
import BishopBlack from "@/components/ChessPiece/Black/BishopBlack";
import KnightWhite from "@/components/ChessPiece/White/KnightWhite";
import KnightBlack from "@/components/ChessPiece/Black/KnightBlack";
import PawnWhite from "@/components/ChessPiece/White/PawnWhite";
import PawnBlack from "@/components/ChessPiece/Black/PawnBlack";
import KingWhite from "@/components/ChessPiece/White/KingWhite";
import KingBlack from "@/components/ChessPiece/Black/KingBlack";

// Прямые импорты — загрузятся при старте
const pieceIconCache: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  queen_white: QueenWhite,
  queen_black: QueenBlack,
  rook_white: RookWhite,
  rook_black: RookBlack,
  bishop_white: BishopWhite,
  bishop_black: BishopBlack,
  knight_white: KnightWhite,
  knight_black: KnightBlack,
  pawn_white: PawnWhite,
  pawn_black: PawnBlack,
  king_white: KingWhite,
  king_black: KingBlack,
};

export default pieceIconCache;
