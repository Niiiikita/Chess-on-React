import { Suspense, useEffect, useRef, useState } from "react";
import Board from "../Board/Board";
import { useChessGame } from "@/hooks/useChessGame";
import { useOnlineGame } from "@/hooks/useOnlineGame";
import type {
  GameModeType,
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
    onGameOver,
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
      setGameId(code);
    }
  }, [createGame, gameId, joinGame, userId]);

  // === 2. Обработка создания игры ===
  useEffect(() => {
    const cleanup = onGameCreated(({ gameId }) => {
      console.log("[OnlineGameScreen] Игра создана!", { gameId });
      setWaitingForOpponent(gameId);
      setGameId(gameId);
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

        // ✅ ✅ ✅ ЭТО ПРАВИЛЬНО — УСТАНАВЛИВАЕМ СВОЙ ЦВЕТ!
        const myColor = userId === players.white ? "white" : "black";
        game.setMyColor(myColor); // ← ✅ ТАК!

        setGameId(gameId);

        setWaitingForOpponent(null);
      }
    );

    return cleanup;
  }, [game, onGameStarted, userId]);

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

        localStorage.removeItem("onlineGameId");
        localStorage.removeItem("lastOnlineGameId");
      }
    });

    return cleanup;
  }, [game, onGameOver, userId]);

  // === 4. Ход оппонента — теперь получаем всё от сервера ===
  useEffect(() => {
    const handler = (data: {
      fen: string;
      turn: "white" | "black";
      lastMove: {
        from: string;
        to: string;
        pieceType: string;
        doublePawnMove?: boolean;
      } | null;
      capturedPieces: { white: string[]; black: string[] };
      gameOver: boolean;
      result: "ongoing" | "checkmate" | "stalemate" | "draw" | "resignation";
    }) => {
      console.log("[OnlineGameScreen] Ход оппонента получен", data);

      const newBoard = fenToBoard(data.fen);

      // ✅ ПРОВЕРКА: ЭТО ХОД СОПЕРНИКА? (ЕСЛИ НЕ ВАШ)
      const isOpponentMove = data.turn !== game.currentPlayer;

      // ✅ ОБНОВЛЯЕМ ДОСКУ ВСЕГДА
      game.setBoard(newBoard);
      game.setCurrentPlayer(data.turn);

      // ✅ ОБНОВЛЯЕМ capturedPieces ВСЕГДА
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

      const convertPieceToPieceType = (
        symbol: string,
        color: "white" | "black"
      ): PieceType => {
        const typeMap: Record<string, PieceData["type"]> = {
          p: "pawn",
          r: "rook",
          n: "knight",
          b: "bishop",
          q: "queen",
          k: "king",
        };
        const type = typeMap[symbol.toLowerCase()];
        if (!type) throw new Error(`Недопустимый тип фигуры: ${symbol}`);
        return { type, color };
      };

      game.setCapturedPieces({
        white: data.capturedPieces.white.map(convertCapturedPiece),
        black: data.capturedPieces.black.map(convertCapturedPiece),
      });

      // ✅ ОБНОВЛЯЕМ gameOver
      if (
        data.gameOver &&
        (data.result === "checkmate" || data.result === "stalemate")
      ) {
        game.setGameOver(data.result);
      }

      // ✅ ✅ ✅ ТОЛЬКО ЕСЛИ ЭТО ХОД СОПЕРНИКА — ОБНОВЛЯЕМ lastMove!
      if (isOpponentMove && data.lastMove) {
        const pieceColor =
          data.lastMove.pieceType === data.lastMove.pieceType.toUpperCase()
            ? "white"
            : "black";

        const newLastMove = {
          from: [
            8 - parseInt(data.lastMove.from[1]),
            data.lastMove.from.charCodeAt(0) - 97,
          ] as [number, number],
          to: [
            8 - parseInt(data.lastMove.to[1]),
            data.lastMove.to.charCodeAt(0) - 97,
          ] as [number, number],
          piece: convertPieceToPieceType(data.lastMove.pieceType, pieceColor),
          doublePawnMove: data.lastMove.doublePawnMove || false,
        };

        console.log(
          "📡 Получен ход соперника, устанавливаем lastMove:",
          newLastMove
        );
        game.setLastMove(newLastMove); // ← ← ← ТОЛЬКО ЗДЕСЬ!
      }

      // ✅ Если это ваш ход — НЕ трогаем lastMove! Он уже обновлён локально.
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
          resign={resignGame}
          userId={userId}
          gameId={gameId}
          gameState={gameState}
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
      resign={resignGame}
    />
  );
}
