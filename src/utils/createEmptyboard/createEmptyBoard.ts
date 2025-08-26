import type { Board } from "../typeBoard/types";

export function createEmptyBoard(): Board {
  const emptyBoard = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null)); // Создаем пустую доску
  // console.log(emptyBoard);
  return emptyBoard;
}
