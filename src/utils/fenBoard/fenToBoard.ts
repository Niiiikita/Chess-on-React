import { PieceType } from "../typeBoard/types";

// 🔧 Вспомогательная функция
function parsePiece(fenChar: string): PieceType {
  const color = fenChar === fenChar.toUpperCase() ? "white" : "black";

  const pieceMap = {
    p: "pawn",
    r: "rook",
    n: "knight",
    b: "bishop",
    q: "queen",
    k: "king",
  } as const;

  const pieceType = pieceMap[fenChar.toLowerCase() as keyof typeof pieceMap];

  if (!pieceType) {
    throw new Error(`Неверный символ фигуры в FEN: ${fenChar}`);
  }

  return {
    type: pieceType, // ✅ Теперь тип: "pawn" | "rook" | ...
    color,
  };
}

export function fenToBoard(fen: string): PieceType[][] {
  const rows = fen.split(" ")[0].split("/");
  const board: PieceType[][] = [];

  for (let i = 0; i < 8; i++) {
    const row: (PieceType | null)[] = [];
    let col = 0;
    for (const char of rows[i]) {
      if (char >= "1" && char <= "8") {
        const empty = parseInt(char);
        for (let j = 0; j < empty; j++) {
          row[col++] = null;
        }
      } else {
        row[col++] = parsePiece(char);
      }
    }
    // 🔥 Гарантируем новую строку
    board.push([...row]);
  }

  // 🔥 Возвращаем новый массив
  return [...board];
}
