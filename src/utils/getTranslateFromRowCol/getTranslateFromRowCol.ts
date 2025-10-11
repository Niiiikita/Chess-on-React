interface TranslateResult {
  translateX: number;
  translateY: number;
  squareSize: {
    width: number;
    height: number;
  };
}

export default function getTranslateFromRowCol(
  row: number,
  col: number,
  boardElement: HTMLElement | null
): TranslateResult | null {
  // Проверяем, что элемент существует
  if (!boardElement) return null;

  const boardRect = boardElement.getBoundingClientRect();

  // Проверяем, что размеры корректны
  if (boardRect.width === 0 || boardRect.height === 0) return null;

  // Вычисляем размер одной клетки
  const squareSize = {
    width: boardRect.width / 8,
    height: boardRect.height / 8,
  };

  // Вычисляем позицию центра клетки в пикселях относительно доски
  // Центрируем фигуру в клетке
  const translateX = col * squareSize.width + squareSize.width / 2;
  const translateY = row * squareSize.height + squareSize.height / 2;

  return {
    translateX,
    translateY,
    squareSize,
  };
}
