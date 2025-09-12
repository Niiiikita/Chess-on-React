import { lazy } from "react";

export const LazyOnlineGameScreen = lazy(() =>
  import("./OnlineGameScreen").then(({ OnlineGameScreen }) => ({
    default: OnlineGameScreen,
  }))
);
