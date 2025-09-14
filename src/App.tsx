import { Suspense, useEffect, useState } from "react";
import MainMenu from "./components/MainMenu/MainMenu";
import { LazyGameScreen } from "./components/CustomChessBoard/GameScreen.lazy";
import { LazyOnlineGameScreen } from "./components/CustomChessBoard/OnlineGameScreen.lazy";
import { Loader } from "./components/Loader/Loader";
import OnlineMenu from "./components/OnlineMenu/OnlineMenu";
import { GameModeType } from "./utils/typeBoard/types";
import { getModeFromUrl } from "./utils/modeUrl/getModeFromUrl";
import { useSettings } from "./hooks/useSettings";
import styles from "./App.module.css";

export default function App() {
  const [gameMode, setGameMode] = useState<"menu" | GameModeType>("menu");

  useSettings();

  // При старте — получаем режим из URL
  useEffect(() => {
    const mode = getModeFromUrl();
    if (mode !== "menu") {
      setGameMode(mode);
    }
  }, []);

  // Синхронизируем URL при изменении gameMode
  useEffect(() => {
    const url = new URL(window.location.href);
    if (gameMode === "menu") {
      url.searchParams.delete("mode");
    } else {
      url.searchParams.set("mode", gameMode);
    }
    window.history.replaceState({}, "", url);
  }, [gameMode]);

  // Рендерим по режиму
  if (gameMode === "menu") {
    return <MainMenu onStartGame={setGameMode} />;
  }

  if (gameMode === "online") {
    return <OnlineMenu onStartGame={setGameMode} />;
  }

  if (gameMode === "local" || gameMode === "vs-ai") {
    return (
      <Suspense fallback={<Loader />}>
        <LazyGameScreen
          initialMode={gameMode}
          onExitToMenu={() => setGameMode("menu")}
        />
      </Suspense>
    );
  }

  if (gameMode.startsWith("online-")) {
    return (
      <Suspense fallback={<Loader />}>
        <LazyOnlineGameScreen
          initialMode={gameMode}
          onExitToMenu={() => setGameMode("menu")}
        />
      </Suspense>
    );
  }

  return <div className={styles.App}>Неизвестный режим</div>;
}
