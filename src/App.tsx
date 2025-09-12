import { Suspense, useEffect, useState } from "react";
import MainMenu from "./components/MainMenu/MainMenu";
import { LazyGameScreen } from "./components/CustomChessBoard/GameScreen.lazy";
import { LazyOnlineGameScreen } from "./components/CustomChessBoard/OnlineGameScreen.lazy";
import { Loader } from "./components/Loader/Loader";
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
  // Если режим не меню — отрисовываем игру
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

  if (gameMode === "online") {
    return (
      <Suspense fallback={<Loader />}>
        <LazyOnlineGameScreen
          initialMode={gameMode}
          onExitToMenu={() => setGameMode("menu")}
        />
      </Suspense>
    );
  }

  return (
    <div className={styles.App}>
      <MainMenu onStartGame={setGameMode} />
    </div>
  );
}
