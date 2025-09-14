import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "wss://chess-battle.ru"
    : "http://localhost:3001";

let socketInstance: Socket | null = null;

export function useOnlineGame() {
  const socketRef = useRef<Socket | null>(null);
  const initialized = useRef(false);

  // 🔥 Глобальный реф для gameId (доступен внутри замыкания)
  const [gameId, setGameId] = useState<string | null>(null);

  useEffect(() => {
    if (initialized.current) return;

    if (!socketInstance) {
      console.log("[useOnlineGame] Создаём новый сокет...");
      socketInstance = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
      });

      socketInstance.on("connect", () => {
        console.log("[Socket] Подключён:", socketInstance?.id);

        const storedUserId = localStorage.getItem("chessUserId");
        if (storedUserId) {
          socketInstance?.emit("setUserId", storedUserId);
          console.log("[Socket] Отправлен userId:", storedUserId);
        }
      });

      socketInstance.on("disconnect", (reason) => {
        console.warn("[Socket] Отключён:", reason);
      });
    }

    socketRef.current = socketInstance;
    initialized.current = true;

    return () => {};
  }, []);

  // ✅ ОБЪЯВЛЕНИЕ transmissionMove — ВНУТРИ useOnlineGame
  const transmissionMove = (from: string, to: string, gameId?: string) => {
    if (!gameId) {
      console.warn("[useOnlineGame] Не указан ID игры");
      return;
    }

    console.log("[useOnlineGame] Отправка хода на сервер", {
      gameId,
      from,
      to,
    });

    socketRef.current?.emit("makeMove", { gameId: gameId, from, to });
  };

  const createGame = (userId: string) => {
    socketRef.current?.emit("createGame", userId);
  };

  const joinGame = (gameId: string, userId: string) => {
    socketRef.current?.emit("joinGame", { gameId, userId });
    setGameId(gameId); // ← Сохраняем gameId при присоединении
  };

  const syncState = (gameId: string) => {
    socketRef.current?.emit("syncState", gameId);
  };

  const onMoveMade = (
    callback: (data: {
      fen: string;
      turn: "white" | "black";
      lastMove: { from: string; to: string } | null;
      capturedPieces: { white: string[]; black: string[] };
      gameOver: boolean;
      result: "ongoing" | "checkmate" | "stalemate" | "draw" | "resignation";
    }) => void
  ) => {
    socketRef.current?.on("moveMade", callback);
    return () => {
      socketRef.current?.off("moveMade", callback);
    };
  };

  const onGameStarted = (
    callback: (data: {
      players: { white: string; black: string };
      fen: string;
      turn: "white" | "black";
      gameId: string; // ✅ Добавлено
    }) => void
  ) => {
    socketRef.current?.on("gameStarted", callback);
    return () => {
      socketRef.current?.off("gameStarted", callback);
    };
  };

  const onGameCreated = (callback: (data: { gameId: string }) => void) => {
    socketRef.current?.on("gameCreated", callback);
    return () => {
      socketRef.current?.off("gameCreated", callback);
    };
  };

  const onError = (callback: (message: string) => void) => {
    socketRef.current?.on("error", callback);
    return () => {
      socketRef.current?.off("error", callback);
    };
  };

  const onSyncState = (
    callback: (data: {
      fen: string;
      turn: "white" | "black";
      lastMove: { from: string; to: string } | null;
      capturedPieces: { white: string[]; black: string[] };
      gameOver: boolean;
      result: "ongoing" | "checkmate" | "stalemate" | "draw" | "resignation";
      playerColor: "white" | "black" | null;
    }) => void
  ) => {
    socketRef.current?.on("syncState", callback);
    return () => {
      socketRef.current?.off("syncState", callback);
    };
  };

  useEffect(() => {
    console.log("[useOnlineGame] current gameId =", gameId);
  }, [gameId]);

  return {
    createGame,
    joinGame,
    transmissionMove,
    onMoveMade,
    onGameStarted,
    onGameCreated,
    onError,
    onSyncState,
    syncState,
  };
}
