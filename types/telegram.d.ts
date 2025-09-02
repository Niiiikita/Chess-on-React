export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: unknown;
    };
  }
}
