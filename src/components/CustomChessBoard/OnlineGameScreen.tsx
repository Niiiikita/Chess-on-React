import { useEffect, useRef, useState } from "react";
import Board from "../Board/Board";
import { useChessGame } from "@/hooks/useChessGame";
import { useOnlineGame } from "@/hooks/useOnlineGame";
import type { GameModeType } from "@/utils/typeBoard/types";
import { fenToBoard } from "@/utils/fenBoard/fenToBoard";
import { getModeFromUrl } from "@/utils/modeUrl/getModeFromUrl";
import { coordsToSquare } from "@/utils/coordsToSquare/coordsToSquare";
import { boardToFen } from "@/utils/fenBoard/boardToFen";
import { ChessGameState } from "@/utils/typeBoard/ChessGameState";
import { WaitingForOpponent } from "../WaitingForOpponent/WaitingForOpponent";

export function OnlineGameScreen({
  initialMode,
  onExitToMenu,
}: {
  initialMode: GameModeType;
  onExitToMenu: () => void;
}) {
  const [gameState, setGameState] = useState<GameModeType>(initialMode);
  const [waitingForOpponent, setWaitingForOpponent] = useState<string | null>(
    null
  ); // ID игры
  const game = useChessGame();
  const hasJoined = useRef(false);
  const hasCreatedGame = useRef(false);

  const {
    createGame,
    joinGame,
    transmissionMove,
    onMoveMade,
    onGameStarted,
    onGameCreated,
    onError,
  } = useOnlineGame();

  const userId = (() => {
    const stored = localStorage.getItem("chessUserId");
    if (stored) return stored;
    const newId = `user_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    localStorage.setItem("chessUserId", newId);
    return newId;
  })();

  // === 1. Обработка URL: создание vs присоединение ===
  useEffect(() => {
    const mode = getModeFromUrl();
    console.log("[OnlineGameScreen] Режим из URL:", mode);

    if (mode === "online-create") {
      if (hasCreatedGame.current) {
        console.warn("[OnlineGameScreen] Уже создали игру ранее");
        return;
      }

      console.log("[OnlineGameScreen] Создаём новую игру...");
      createGame(userId);
      hasCreatedGame.current = true;
      return;
    }

    if (mode.startsWith("online-join-")) {
      const code = mode.split("online-join-")[1];
      if (hasJoined.current) {
        console.warn("[OnlineGameScreen] Уже пытались присоединиться");
        return;
      }
      console.log("[OnlineGameScreen] Присоединяемся к игре:", code);
      joinGame(code, userId);
      hasJoined.current = true;
    }
  }, [createGame, joinGame, userId]);

  // === 2. Обработка создания игры ===
  useEffect(() => {
    const cleanup = onGameCreated(({ gameId }) => {
      console.log("[OnlineGameScreen] Игра создана!", { gameId });
      setWaitingForOpponent(gameId); // ← показываем экран ожидания
    });
    return cleanup;
  }, [onGameCreated]);

  // === 3. Обработка начала игры ===
  useEffect(() => {
    const cleanup = onGameStarted(
      (data: {
        players: { white: string; black: string };
        fen: string;
        turn: "white" | "black";
      }) => {
        console.log("[OnlineGameScreen] Игра началась!", data);

        // 🔥 Определяем цвет игрока
        const playerColor = data.players.white === userId ? "white" : "black";

        const newBoard = fenToBoard(data.fen);
        game.setBoard(newBoard);

        // Устанавливаем, кто ходит
        if (data.turn === playerColor) {
          game.setCurrentPlayer(playerColor); // можно ходить
        } else {
          game.setCurrentPlayer(data.turn); // ждём хода
        }

        setWaitingForOpponent(null);
      }
    );
    return cleanup;
  }, [game, onGameStarted, userId]);

  // === 4. Ход оппонента ===
  useEffect(() => {
    const cleanup = onMoveMade(
      (data: { fen: string; turn: "white" | "black" }) => {
        console.log("[OnlineGameScreen] Ход оппонента получен", data); // 🔴 Должен быть в консоли
        const newBoard = fenToBoard(data.fen);
        game.setBoard(newBoard); // ✅ Меняем доску
        game.setCurrentPlayer(data.turn); // ✅ Меняем ход
      }
    );
    return cleanup;
  }, [game, onMoveMade]);

  // === 5. Ошибки ===
  useEffect(() => {
    const cleanup = onError((message) => {
      console.error("[OnlineGameScreen] Ошибка:", message);
      game.setHint?.(message);

      if (
        message.includes("не найдена") ||
        message.includes("уже занята") ||
        message.includes("самим собой")
      ) {
        setTimeout(() => {
          setGameState("menu");
        }, 2000);
      }
    });
    return cleanup;
  }, [game, onError]);

  // === 6. Перехват makeMove для отправки хода ===
  useEffect(() => {
    const originalMakeMove = window.makeMove;

    window.makeMove = (
      from: { row: number; col: number },
      to: { row: number; col: number },
      context: ChessGameState & { gameState?: GameModeType }
    ) => {
      originalMakeMove?.(from, to, context);

      if (
        context.gameState?.startsWith("online-join-") &&
        context.currentPlayer === "black"
      ) {
        const fen = boardToFen(context.board, "white");
        const gameId = context.gameState.split("online-join-")[1];

        transmissionMove(
          coordsToSquare(from.row, from.col),
          coordsToSquare(to.row, to.col),
          fen,
          "white",
          gameId
        );
      }
    };

    return () => {
      window.makeMove = originalMakeMove;
    };
  }, [transmissionMove]);

  // === 7. Выход в меню ===
  useEffect(() => {
    if (gameState === "menu") {
      hasCreatedGame.current = false;
      hasJoined.current = false;
      setWaitingForOpponent(null);
      onExitToMenu();
    }
  }, [gameState, onExitToMenu]);

  // === 8. Рендер ===
  if (waitingForOpponent) {
    return (
      <WaitingForOpponent
        gameId={waitingForOpponent}
        onBack={() => setGameState("menu")}
      />
    );
  }

  return (
    <Board
      gameState={gameState}
      setGameState={setGameState}
    />
  );
}
