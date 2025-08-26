export function coordsToSquare(row: number, col: number): string {
  if (row < 0 || row > 7 || col < 0 || col > 7) {
    // throw new Error("Неверные координаты");
    return "";
  }

  // console.log(`${String.fromCharCode(97 + col)}${8 - row}`);

  return `${String.fromCharCode(97 + col)}${8 - row}`;
}
