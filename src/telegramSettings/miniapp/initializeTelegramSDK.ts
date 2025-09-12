import { init, miniApp, swipeBehavior, viewport } from "@telegram-apps/sdk";
import { isTMA } from "@telegram-apps/bridge";

const initializeTelegramSDK = async () => {
  if (!(await isTMA("complete"))) {
    console.warn("Приложение запущено не в Telegram Mini App");
    return;
  }

  try {
    init();
    // Готовим Mini App
    miniApp.mountSync();
    await miniApp.ready();

    // Устанавливаем цвет шапки
    if (miniApp.setHeaderColor.isAvailable()) {
      miniApp.setHeaderColor("#55280c");
      //   miniApp.headerColor(); // '#55280c' - chocolate
    }

    // Устанавливаем поведение вертикального свайпа
    if (swipeBehavior.mount.isAvailable()) {
      swipeBehavior.mount();
      //   swipeBehavior.isMounted(); // true

      if (swipeBehavior.disableVertical.isAvailable()) {
        swipeBehavior.disableVertical();
        // swipeBehavior.isVerticalEnabled(); // false
      }
    }

    //
    if (viewport.expand.isAvailable()) {
      await viewport.mount();
    }

    // if (viewport.requestFullscreen.isAvailable()) {
    //   await viewport.requestFullscreen();
    // }

    // Добавляем лог с задержкой, чтобы eruda успел инициализироваться
    setTimeout(() => {
      console.log("✅ MiniApp готово к использованию");
      console.log(miniApp.isMounted());
    }, 1000);
  } catch (error) {
    console.error("Ошибка инициализации SDK Telegram", error);
  }
};

export default initializeTelegramSDK;
