export function squareToCoords(square: string): [number, number] {
  // Проверка: строка должна быть длиной 2, например 'e2'
  if (square.length !== 2) {
    throw new Error("Неверный формат координаты. Ожидается, например, 'e2'");
  }

  const file = square[0]; // буква: 'a'-'h'
  const rank = square[1]; // цифра: '1'-'8'

  // Проверка, что буква от a до h
  if (file < "a" || file > "h") {
    throw new Error("Буква должна быть от 'a' до 'h'");
  }

  // Проверка, что цифра от 1 до 8
  const digit = Number(rank);
  if (digit < 1 || digit > 8) {
    throw new Error("Цифра должна быть от 1 до 8");
  }

  // Столбец: 'a' -> 0, 'b' -> 1, ..., 'h' -> 7
  const col = file.charCodeAt(0) - 97;

  // Строка: '1' -> 7, '2' -> 6, ..., '8' -> 0
  const row = 8 - digit;

  const coords: [number, number] = [row, col]; // e4 -> [3, 4]

  //   console.log(coords);

  return coords;
}
