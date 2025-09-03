import { useEffect } from "react";
import { mockTelegramEnv } from "@telegram-apps/bridge";

export function useTelegramMock() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      const params = new URLSearchParams();

      params.set("tgWebAppPlatform", "android");
      params.set("tgWebAppVersion", "7.2");
      params.set(
        "tgWebAppThemeParams",
        JSON.stringify({
          bg_color: "#000000",
          text_color: "#ffffff",
          hint_color: "#aaaaaa",
          link_color: "#6ab3f3",
          button_color: "#007AFF",
          button_text_color: "#ffffff",
        })
      );
      params.set(
        "tgWebAppUser",
        JSON.stringify({
          id: 123456789,
          first_name: "Никита",
          last_name: "Тест",
          username: "nikita_test",
          language_code: "ru",
          is_premium: true,
        })
      );
      params.set("tgWebAppChatType", "private");
      params.set("tgWebAppChatInstance", "123456789");

      mockTelegramEnv({ launchParams: params });
    }
  }, []);
}
