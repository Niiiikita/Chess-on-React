export {};

declare global {
  interface Window {
    eruda?: {
      init: () => void;
      hide: () => void;
      // Можно добавить другие методы, если нужно
    };
  }
}
