import { lazy } from "react";

export const LazyPopupChoosingFigure = lazy(() =>
  import("./PopupChoosingFigure").then(({ default: PopupChoosingFigure }) => ({
    default: PopupChoosingFigure,
  }))
);
