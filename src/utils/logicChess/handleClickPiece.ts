import { useChessGame } from "@/hooks/useChessGame";
import { coordsToSquare } from "../coordsToSquare/coordsToSquare";
import type { GameModeType, PieceType, Settings } from "../typeBoard/types";
import { getLegalMoves } from "./getLegalMoves";
import { makeMove } from "./makeMove";

export function handleClickPiece(
  e: React.MouseEvent,
  piece: PieceType,
  rowIdx: number,
  colIdx: number,
  context: ReturnType<typeof useChessGame> & {
    settings: Settings;
    gameState: GameModeType;
    gameId?: string | null;
    transmissionMove?: (
      from: string,
      to: string,
      gameId?: string,
      promotion?: "q" | "r" | "b" | "n"
    ) => void;
    setMovingPiece?: (
      movingPiece: {
        piece: PieceType;
        fromRow: number;
        fromCol: number;
        toRow: number;
        toCol: number;
      } | null
    ) => void;
    boardRef?: React.RefObject<HTMLDivElement | null>;
  }
) {
  // Получаем контекст
  const {
    possibleMove,
    setPossibleMove,
    board,
    lastMove,
    selectedFrom,
    setSelectedFrom,
    hasKingMoved,
    hasRookMoved,
    currentPlayer,
    myColor,
    setHintWithTimer,
    settings,
  } = context;

  e.preventDefault();

  const currentSquare = coordsToSquare(rowIdx, colIdx);

  //  ШАГ 1: ЕСЛИ УЖЕ ВЫБРАНА ФИГУРА — ПРОВЕРЯЕМ, МОЖНО ЛИ СЮДА ПОЙТИ
  if (selectedFrom !== null) {
    console.log("[handleClickPiece] Уже выбрана фигура:", selectedFrom);
    if (possibleMove.includes(currentSquare)) {
      console.log("[handleClickPiece] Возможный ход на:", currentSquare);

      // Запускаем анимацию перед обновлением состояния
      if (settings.animations && context.setMovingPiece) {
        console.log("[handleClickPiece] Запуск анимации");
        context.setMovingPiece({
          piece: board[selectedFrom.row][selectedFrom.col],
          fromRow: selectedFrom.row,
          fromCol: selectedFrom.col,
          toRow: rowIdx,
          toCol: colIdx,
        });

        // Задерживаем обновление состояния до завершения анимации
        setTimeout(() => {
          console.log("[handleClickPiece] Обновление состояния после анимации");
          makeMove(
            { row: selectedFrom.row, col: selectedFrom.col },
            { row: rowIdx, col: colIdx },
            { ...context }
          );
        }, 300); // Длительность анимации
      } else {
        console.log(
          "[handleClickPiece] Анимация не поддерживается, обновляем состояние сразу"
        );
        // Если анимация не поддерживается, обновляем состояние сразу
        makeMove(
          { row: selectedFrom.row, col: selectedFrom.col },
          { row: rowIdx, col: colIdx },
          { ...context }
        );
      }

      setSelectedFrom(null);
      setPossibleMove([]);
      setHintWithTimer(null);
      return;
    }

    // Не цель — но может, кликнули на другую свою фигуру?
    if (piece && piece.color === currentPlayer) {
      console.log("[handleClickPiece] Клик на другую свою фигуру");
      // Продолжим к шагу 4
    } else {
      console.log("[handleClickPiece] Сброс выбора фигуры");
      setSelectedFrom(null);
      setPossibleMove([]);
      setHintWithTimer(null);
      return;
    }
  }

  // ШАГ 2: КЛИК НА ПУСТУЮ КЛЕТКУ — СБРАСЫВАЕМ
  if (!piece) {
    setSelectedFrom(null);
    setPossibleMove([]);
    setHintWithTimer(null);
    return;
  }

  // ШАГ 3: ПРОВЕРКА — ЭТО НЕ МОЙ ХОД? (ОНЛАЙН)
  if (context.gameState.startsWith("online")) {
    if (currentPlayer !== myColor) {
      setSelectedFrom(null);
      setPossibleMove([]);
      setHintWithTimer(
        `Сейчас ход ${currentPlayer === "white" ? "белых" : "чёрных"}!`
      );
      return;
    }

    // Ваш ход — но можно только свою фигуру
    if (piece.color !== myColor) {
      setSelectedFrom(null);
      setPossibleMove([]);
      setHintWithTimer("Это фигура вашего оппонента!");
      return;
    }
  }

  // ШАГ 4: ПРОВЕРКА — ЛОКАЛЬНЫЕ РЕЖИМЫ (local / vs-ai)
  if (context.gameState === "local" || context.gameState === "vs-ai") {
    if (piece.color !== currentPlayer) {
      setSelectedFrom(null);
      setPossibleMove([]);
      setHintWithTimer(
        `Сейчас ход ${currentPlayer === "white" ? "белых" : "чёрных"}!`
      );
      return;
    }
  }

  // ШАГ 5: КЛИК НА СВОЮ ФИГУРУ — ПОКАЗЫВАЕМ ХОДЫ
  if (
    (context.gameState.startsWith("online") && piece.color === myColor) ||
    ((context.gameState === "local" || context.gameState === "vs-ai") &&
      piece.color === currentPlayer)
  ) {
    if (
      selectedFrom &&
      selectedFrom.row === rowIdx &&
      selectedFrom.col === colIdx
    ) {
      setSelectedFrom(null);
      setPossibleMove([]);
      setHintWithTimer(null);
      return;
    }

    const moves = getLegalMoves(
      piece,
      rowIdx,
      colIdx,
      board,
      lastMove,
      hasKingMoved,
      hasRookMoved
    );

    setSelectedFrom({ row: rowIdx, col: colIdx });
    setPossibleMove(moves);
    setHintWithTimer(null);
    return;
  }

  // ШАГ 6: КЛИК НА ЧУЖУЮ ФИГУРУ — ПРОВЕРЯЕМ, МОЖНО ЛИ ТУДА ПОЙТИ
  if (
    (context.gameState.startsWith("online") && piece.color !== myColor) ||
    ((context.gameState === "local" || context.gameState === "vs-ai") &&
      piece.color !== currentPlayer)
  ) {
    if (possibleMove.includes(currentSquare)) {
      if (selectedFrom) {
        makeMove(
          { row: selectedFrom.row, col: selectedFrom.col },
          { row: rowIdx, col: colIdx },
          { ...context }
        );
        setSelectedFrom(null);
        setPossibleMove([]);
        setHintWithTimer(null);
        return;
      }
    }

    setSelectedFrom(null);
    setPossibleMove([]);
    setHintWithTimer(null);
    return;
  }

  // Защита
  setSelectedFrom(null);
  setPossibleMove([]);
  setHintWithTimer(null);
}
