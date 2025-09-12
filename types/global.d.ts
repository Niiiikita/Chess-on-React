import { ChessGameState } from "@/utils/typeBoard/ChessGameState";
import type { GameModeType } from "@/utils/typeBoard/types";

declare global {
  interface Window {
    /**
     * Глобальная функция для выполнения хода.
     * Используется в Square, makeAIMove, OnlineGameScreen.
     */
    makeMove?: (
      from: { row: number; col: number },
      to: { row: number; col: number },
      context: ChessGameState & { gameState?: GameModeType }
    ) => void;
  }
}

export {};
