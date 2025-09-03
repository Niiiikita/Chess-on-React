import { Suspense, useEffect, useState } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { LazyGameScreen } from "./components/CustomChessBoard/GameScreen.lazy";
import MainMenu from "./components/MainMenu/MainMenu";
import { Loader } from "./components/Loader/Loader";
import { GameModeType } from "./utils/typeBoard/types";
import { getModeFromUrl } from "./utils/modeUrl/getModeFromUrl";
// import { useTelegramMock } from "./hooks/useTelegramMock";
import styles from "./App.module.css";

export default function App() {
  const [gameMode, setGameMode] = useState<"menu" | GameModeType>("menu");
  // useTelegramMock(); // Мок только в dev
  const tg = useTelegram();

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, [tg]);

  // При старте — получаем режим из URL
  useEffect(() => {
    const mode = getModeFromUrl();
    if (mode !== "menu") {
      setGameMode(mode);
    }
  }, []);
  // Если режим не меню — отрисовываем игру
  if (gameMode !== "menu") {
    return (
      <Suspense fallback={<Loader />}>
        <LazyGameScreen
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
