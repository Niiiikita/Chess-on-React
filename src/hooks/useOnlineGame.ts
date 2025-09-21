import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "wss://chess-battle.ru"
    : "http://localhost:3001";

export function useOnlineGame() {
  const socketRef = useRef<Socket | null>(null);
  const initialized = useRef(false);
  const [gameId, setGameId] = useState<string | null>(null);

  // 🔥 Инициализация сокета — ТОЛЬКО при первом вызове хука (т.е. когда компонент монтируется)
  useEffect(() => {
    if (initialized.current) return;

    console.log("[useOnlineGame] Создаём новый сокет...");
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketRef.current.on("connect", () => {
      console.log("[Socket] Подключён:", socketRef.current?.id);
      const storedUserId = localStorage.getItem("chessUserId");
      if (storedUserId) {
        socketRef.current?.emit("setUserId", storedUserId);
        console.log("[Socket] Отправлен userId:", storedUserId);
      }
    });

    socketRef.current.on("disconnect", (reason) => {
      console.warn("[Socket] Отключён:", reason);
    });

    initialized.current = true;

    return () => {};
  }, []); // ← Пустой массив — запускается только один раз при монтировании

  // ✅ Функции для взаимодействия с сервером
  const createGame = (userId: string) => {
    socketRef.current?.emit("createGame", userId);
  };

  const joinGame = (gameId: string, userId: string) => {
    socketRef.current?.emit("joinGame", { gameId, userId });
    setGameId(gameId);
  };

  const transmissionMove = (
    from: string,
    to: string,
    gameId?: string,
    promotion?: "q" | "r" | "b" | "n"
  ) => {
    const id = gameId || localStorage.getItem("onlineGameId");
    if (!id) {
      console.warn("[useOnlineGame] Не указан ID игры");
      return;
    }

    console.log("[useOnlineGame] Отправка хода на сервер", {
      gameId: id,
      from,
      to,
      promotion,
    });

    socketRef.current?.emit("makeMove", {
      gameId: id,
      from,
      to,
      promotion,
    });
  };

  const resignGame = (gameId: string) => {
    console.log("[useOnlineGame] Игрок отказался от игры");
    socketRef.current?.emit("resign", gameId);
  };

  const onMoveMade = (
    callback: (data: {
      fen: string;
      turn: "white" | "black";
      lastMove: { from: string; to: string; pieceType: string } | null;
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
      gameId: string;
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

  const onGameOver = (
    callback: (data: {
      reason: "resignation" | "opponent_left";
      winner: string;
      winnerColor: "white" | "black";
    }) => void
  ) => {
    socketRef.current?.on("gameOver", callback);
    return () => {
      socketRef.current?.off("gameOver", callback);
    };
  };

  // 📊 Полезный лог для отладки
  useEffect(() => {
    console.log("[useOnlineGame] current gameId =", gameId);
  }, [gameId]);

  return {
    createGame,
    joinGame,
    transmissionMove,
    resignGame,
    onMoveMade,
    onGameStarted,
    onGameCreated,
    onError,
    onSyncState,
    onGameOver,
  };
}
