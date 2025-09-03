import { Suspense, useEffect, useState } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { LazyGameScreen } from "./components/CustomChessBoard/GameScreen.lazy";
import MainMenu from "./components/MainMenu/MainMenu";
import { Loader } from "./components/Loader/Loader";
import { GameModeType } from "./utils/typeBoard/types";
import { getModeFromUrl } from "./utils/modeUrl/getModeFromUrl";
// import { useTelegramMock } from "./hooks/useTelegramMock";
import styles from "./App.module.css";
import { ErudaInitializer } from "./components/ErudaInitializer/ErudaInitializer";

export default function App() {
  const [gameMode, setGameMode] = useState<"menu" | GameModeType>("menu");
  const tg = useTelegram();

  useEffect(() => {
    if (tg) {
      tg.ready(); // Готов к работе
      tg.expand(); // На весь экран
      console.log("Telegram WebApp:", tg.initDataUnsafe);
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
      <>
        <ErudaInitializer />

        <Suspense fallback={<Loader />}>
          <LazyGameScreen
            initialMode={gameMode}
            onExitToMenu={() => setGameMode("menu")}
          />
        </Suspense>
      </>
    );
  }

  return (
    <div className={styles.App}>
      <ErudaInitializer />

      <MainMenu onStartGame={setGameMode} />
    </div>
  );
}
