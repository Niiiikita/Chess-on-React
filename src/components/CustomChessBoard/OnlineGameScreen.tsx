import { Suspense, useEffect, useRef, useState } from "react";
import Board from "../Board/Board";
import { useChessGame } from "@/hooks/useChessGame";
import { useOnlineGame } from "@/hooks/useOnlineGame";
import type {
  GameModeType,
  GameOverType,
  PieceData,
  PieceType,
} from "@/utils/typeBoard/types";
import { fenToBoard } from "@/utils/fenBoard/fenToBoard";
import { getModeFromUrl } from "@/utils/modeUrl/getModeFromUrl";
import { WaitingForOpponent } from "../WaitingForOpponent/WaitingForOpponent";
import { LazyGameOverModal } from "../GameOver/GameOverModal.lazy";

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
  );
  const game = useChessGame();
  const hasJoined = useRef(false);
  const hasCreatedGame = useRef(false);

  const [gameId, setGameId] = useState<string | null>(null);

  const [gameOverReason, setGameOverReason] = useState<{
    reason: "opponent_left" | "resignation";
    winner: string;
    winnerColor: "white" | "black";
  } | null>(null);

  const {
    createGame,
    joinGame,
    transmissionMove,
    onMoveMade,
    onGameStarted,
    onGameCreated,
    onError,
    onSyncState,
    onGameOver,
    syncState,
    resignGame,
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
      if (hasCreatedGame.current) return;
      console.log("[OnlineGameScreen] Создаём новую игру...");
      createGame(userId);
      hasCreatedGame.current = true;
      return;
    }

    if (mode.startsWith("online-join-")) {
      const code = mode.slice("online-join-".length);
      if (hasJoined.current) return;

      if (code === gameId) {
        console.error(
          "[OnlineGameScreen] Вы пытаетесь присоединиться к своей собственной игре!"
        );
        setGameState("menu");
        return;
      }

      console.log(
        "[OnlineGameScreen] Пытаюсь присоединиться к игре:",
        code,
        "с userId:",
        userId
      );
      joinGame(code, userId);
      hasJoined.current = true;
      setGameId(code); // ✔️ ИСПРАВЛЕНО!
    }
  }, [createGame, gameId, joinGame, userId]);

  // === 2. Обработка создания игры ===
  useEffect(() => {
    const cleanup = onGameCreated(({ gameId }) => {
      console.log("[OnlineGameScreen] Игра создана!", { gameId });
      setWaitingForOpponent(gameId);
      setGameId(gameId); // ✔️ ИСПРАВЛЕНО!
    });
    return cleanup;
  }, [onGameCreated]);

  // === 3. Обработка начала игры ===
  useEffect(() => {
    const cleanup = onGameStarted(
      ({
        players,
        fen,
        turn,
        gameId,
      }: {
        players: { white: string; black: string };
        fen: string;
        turn: "white" | "black";
        gameId: string;
      }) => {
        console.log("[OnlineGameScreen] Игра началась!", {
          players,
          fen,
          turn,
          gameId,
        });

        const newBoard = fenToBoard(fen);
        game.setBoard(newBoard);
        game.setCurrentPlayer(turn);

        setGameId(gameId);

        setWaitingForOpponent(null);

        setTimeout(() => {
          if (gameId) {
            syncState(gameId);
          }
        }, 100);
      }
    );

    return cleanup;
  }, [game, onGameStarted, syncState, userId]);

  // === 3.5. Обработка окончания игры ===
  useEffect(() => {
    const cleanup = onGameOver(({ reason, winner, winnerColor }) => {
      console.log("[OnlineGameScreen] Игра завершилась", {
        reason,
        winner,
        winnerColor,
      });

      if (reason === "resignation" || reason === "opponent_left") {
        // Сохраняем причину и результат
        setGameOverReason({
          reason,
          winner,
          winnerColor,
        });

        // Показываем подсказку (опционально)
        const isWinner = winner === userId;
        const yourColor = game.currentPlayer;

        if (reason === "opponent_left") {
          game.setHintWithTimer("Ваш оппонент покинул игру");
        } else if (isWinner) {
          game.setHintWithTimer(
            `Победа за ${yourColor === "white" ? "белыми" : "чёрными"}!`
          );
        } else {
          game.setHintWithTimer(
            `Вы проиграли. Победил ${
              winnerColor === "white" ? "белый" : "чёрный"
            } игрок.`
          );
        }

        localStorage.removeItem("onlineGameId"); // ← ОЧИЩАЕМ СТАРЫЙ GAMEID!
        localStorage.removeItem("lastOnlineGameId"); // ← ОЧИЩАЕМ И ЭТО, если есть
      }
    });

    return cleanup;
  }, [game, onGameOver, userId]);

  // === 4. Ход оппонента — теперь получаем всё от сервера ===
  useEffect(() => {
    const handler = (data: {
      fen: string;
      turn: "white" | "black";
      lastMove: { from: string; to: string } | null;
      capturedPieces: { white: string[]; black: string[] };
      gameOver: boolean;
      result: "ongoing" | "checkmate" | "stalemate" | "draw" | "resignation";
    }) => {
      console.log("[OnlineGameScreen] Ход оппонента получен", data);

      const newBoard = fenToBoard(data.fen);
      const newLastMove = data.lastMove
        ? {
            from: [
              8 - parseInt(data.lastMove.from[1]), // ← ИСПРАВЛЕНО: from[1], а не to[1]
              data.lastMove.from.charCodeAt(0) - "a".charCodeAt(0),
            ] as [number, number], // ← Явное приведение к кортежу
            to: [
              8 - parseInt(data.lastMove.to[1]), // ← ИСПРАВЛЕНО: to[1]
              data.lastMove.to.charCodeAt(0) - "a".charCodeAt(0),
            ] as [number, number], // ← Явное приведение
            piece: null,
          }
        : null;

      const convertCapturedPiece = (symbol: string): PieceType => {
        const color = symbol === symbol.toUpperCase() ? "white" : "black";
        const typeMap: Record<string, PieceData["type"]> = {
          p: "pawn",
          r: "rook",
          n: "knight",
          b: "bishop",
          q: "queen",
          k: "king",
        };
        const type = typeMap[symbol.toLowerCase()];
        if (!type) throw new Error(`Неизвестный символ фигуры: ${symbol}`);
        return { type, color };
      };

      game.setBoard(newBoard);
      game.setCurrentPlayer(data.turn);
      game.setLastMove(newLastMove);
      game.setCapturedPieces({
        white: data.capturedPieces.white.map(convertCapturedPiece),
        black: data.capturedPieces.black.map(convertCapturedPiece),
      });

      if (
        data.gameOver &&
        (data.result === "checkmate" || data.result === "stalemate")
      ) {
        game.setGameOver(data.result);
      }
    };

    const cleanup = onMoveMade(handler);
    return cleanup;
  }, [game, onMoveMade]);

  // === 5. Ошибки ===
  useEffect(() => {
    const cleanup = onError((message) => {
      console.error("[OnlineGameScreen] Ошибка:", message);
      game.setHintWithTimer?.(message);

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

  // === 7. ВОССТАНОВЛЕНИЕ ИГРЫ ИЗ localStorage ===
  useEffect(() => {
    const mode = getModeFromUrl();

    // Не восстанавливаем, если пользователь уже в режиме создания/присоединения
    if (mode === "online-create" || mode.startsWith("online-join-")) {
      return; // Пропускаем восстановление — оно не нужно!
    }

    const savedGameId = localStorage.getItem("onlineGameId");
    if (savedGameId && !hasJoined.current && !hasCreatedGame.current) {
      console.log(
        "[OnlineGameScreen] Восстанавливаем игру из localStorage:",
        savedGameId
      );
      joinGame(savedGameId, userId);
      hasJoined.current = true;
      setGameId(savedGameId);

      setTimeout(() => {
        syncState(savedGameId);
      }, 100);
    }
  }, [joinGame, syncState, userId]);

  // === 8. Сохраняем gameId в localStorage при присоединении ===
  useEffect(() => {
    if (gameId && !localStorage.getItem("onlineGameId")) {
      localStorage.setItem("onlineGameId", gameId);
      console.log("[OnlineGameScreen] Сохранён gameId в localStorage:", gameId);
    }
  }, [gameId]);

  // === 9. Подписка на syncState — чтобы получить актуальное состояние ===
  useEffect(() => {
    const handler = (data: {
      fen: string;
      turn: "white" | "black";
      lastMove: { from: string; to: string } | null;
      capturedPieces: { white: string[]; black: string[] };
      gameOver: boolean;
      result: "ongoing" | "checkmate" | "stalemate" | "draw" | "resignation";
      playerColor: "white" | "black" | null;
    }) => {
      console.log("[OnlineGameScreen] Получено syncState:", data);

      // playerColor используется здесь — больше не "ненужная переменная"
      if (!data.playerColor) return;

      const newBoard = fenToBoard(data.fen);
      game.setBoard(newBoard);
      game.setCurrentPlayer(data.turn);

      // Приведение lastMove
      if (data.lastMove) {
        const squareToCoord = (sq: string): [number, number] => {
          const col = sq.charCodeAt(0) - "a".charCodeAt(0);
          const row = 8 - parseInt(sq[1]);
          return [row, col];
        };

        const fromCoords = squareToCoord(data.lastMove.from);
        const toCoords = squareToCoord(data.lastMove.to);

        const piece = game.board[fromCoords[0]]?.[fromCoords[1]] || null;

        game.setLastMove({
          from: fromCoords,
          to: toCoords,
          piece,
        });
      }

      // Приведение capturedPieces
      const convertCaptured = (pieces: string[]): PieceType[] =>
        pieces.map((p) => ({
          type: p.toLowerCase() as Extract<
            PieceType,
            "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"
          >,
          color: p === p.toUpperCase() ? "white" : "black",
        }));

      game.setCapturedPieces({
        white: convertCaptured(data.capturedPieces.white),
        black: convertCaptured(data.capturedPieces.black),
      });

      // Приведение result → gameOver
      let gameOverType: GameOverType = null;
      if (
        data.gameOver &&
        (data.result === "checkmate" || data.result === "stalemate")
      ) {
        gameOverType = data.result;
      }
      game.setGameOver(gameOverType);

      // Если игра началась — скрываем экран ожидания
      if (waitingForOpponent) {
        setWaitingForOpponent(null);
      }
    };

    const cleanup = onSyncState(handler);
    return cleanup;
  }, [game, onSyncState, waitingForOpponent]);

  // === 10. Выход в меню ===
  useEffect(() => {
    if (gameState === "menu") {
      hasCreatedGame.current = false;
      hasJoined.current = false;
      setWaitingForOpponent(null);

      onExitToMenu();
    }
  }, [gameId, gameState, onExitToMenu]);

  // === 11. Рендер ===
  if (waitingForOpponent) {
    return (
      <WaitingForOpponent
        gameId={waitingForOpponent}
        setGameState={setGameState}
        resignGame={resignGame}
      />
    );
  }

  if (gameOverReason) {
    return (
      <Suspense fallback={<div>Загрузка...</div>}>
        <LazyGameOverModal
          reason={gameOverReason.reason}
          winner={gameOverReason.winner}
          userId={userId}
          setGameState={setGameState}
        />
      </Suspense>
    );
  }

  return (
    <Board
      gameState={gameState}
      setGameState={setGameState}
      transmissionMove={transmissionMove}
      gameId={gameId}
      game={game}
      resign={resignGame}
    />
  );
}
