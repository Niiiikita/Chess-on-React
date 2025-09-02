import { lazy } from "react";

export const LazyGameOverModal = lazy(() =>
  import("./GameOverModal").then(({ default: GameOverModal }) => ({
    default: GameOverModal,
  }))
);
