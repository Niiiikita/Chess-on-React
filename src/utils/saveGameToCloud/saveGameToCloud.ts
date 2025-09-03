import { cloudStorage } from "@telegram-apps/sdk";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveGameToCloud(game: any) {
  try {
    await cloudStorage.setItem("chess-game", JSON.stringify(game));
  } catch (e) {
    console.error("Ошибка сохранения:", e);
  }
}

export async function loadGameFromCloud() {
  try {
    const saved = await cloudStorage.getItem("chess-game");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error("Ошибка загрузки:", e);
    return null;
  }
}
