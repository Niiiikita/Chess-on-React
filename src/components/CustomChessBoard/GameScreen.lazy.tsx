import { lazy } from "react";

export const LazyGameScreen = lazy(() =>
  import("./GameScreen").then(({ GameScreen }) => ({
    default: GameScreen,
  }))
);
