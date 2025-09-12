import { useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";

const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "wss://chess-battle.ru"
    : "http://localhost:3001";

// 🚀 Глобальный синглтон
let socketInstance: Socket | null = null;

export function useOnlineGame() {
  const socketRef = useRef<Socket | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Если уже инициализирован — выходим
    if (initialized.current) return;

    // Создаём сокет только если его ещё нет
    if (!socketInstance) {
      console.log("[useOnlineGame] Создаём новый сокет...");
      socketInstance = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
      });

      socketInstance.on("connect", () => {
        console.log("[Socket] Подключён:", socketInstance?.id);
      });

      socketInstance.on("disconnect", (reason) => {
        console.warn("[Socket] Отключён:", reason);
      });
    }

    socketRef.current = socketInstance;
    initialized.current = true;

    // Функция очистки (не отключаем сокет!)
    return () => {
      // ⚠️ Ничего не делаем — сокет остаётся живым
    };
  }, []);

  // Храним ID комнаты
  const gameIdRef = useRef<string | null>(null);

  // Методы
  const createGame = (userId: string) => {
    socketRef.current?.emit("createGame", userId);
  };

  const joinGame = (gameId: string, userId: string) => {
    socketRef.current?.emit("joinGame", { gameId, userId });
    gameIdRef.current = gameId;
  };

  const transmissionMove = (
    from: string,
    to: string,
    fen: string,
    turn: "white" | "black",
    gameId?: string
  ) => {
    const id = gameId || gameIdRef.current;
    if (!id) {
      console.warn("[useOnlineGame] Не указан ID игры");
      return;
    }
    socketRef.current?.emit("transmissionMove", {
      gameId: id,
      from,
      to,
      fen,
      turn,
    });
  };

  const onMoveMade = (
    callback: ({ fen, turn }: { fen: string; turn: "white" | "black" }) => void
  ) => {
    socketRef.current?.on("moveMade", callback);
    return () => {
      socketRef.current?.off("moveMade", callback);
    };
  };

  const onGameStarted = (
    callback: ({
      players,
      fen,
      turn,
    }: {
      players: { white: string; black: string };
      fen: string;
      turn: "white" | "black";
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

  return {
    createGame,
    joinGame,
    transmissionMove,
    onMoveMade,
    onGameStarted,
    onGameCreated,
    onError,
  };
}
