import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения из .env файлов

  return {
    // 🌐 Базовая настройка
    root: ".", // Корень проекта (по умолчанию)
    base: "/", // Базовый URL (для деплоя на подпапку: '/my-app/')
    publicDir: "public", // Папка с публичными файлами (копируется как есть)

    // 📁 Псевдонимы (alias)
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@utils": path.resolve(__dirname, "./src/utils"),
      },
    },

    // ⚙️ Плагины
    plugins: [
      // Поддержка React + JSX
      react(),

      // Поддержка SVG как React-компонентов через SVGR
      svgr({
        // Расширения, которые обрабатывать
        include: "**/*.svg?react", // Только с ?react
        // include: '**/*.svg',     // Или все SVG
        svgrOptions: {
          icon: true, // Опционально: делает иконки responsivе
        },
      }),
    ],

    // 🎨 CSS настройки
    css: {
      modules: {
        // Настройка CSS-модулей
        // Пример: Button.module.css -> styles.button
        localsConvention: "camelCase", // .my-class -> myClass
        generateScopedName:
          mode === "development"
            ? "[name]__[local]__[hash:base64:5]"
            : "[hash:base64:8]",
      },
      preprocessorOptions: {
        // Если используешь SCSS/LESS
        scss: {
          api: "modern-compiler", // или 'modern'
        },
      },
      devSourcemap: true, // Sourcemaps для CSS в dev-режиме
    },

    // 🧰 Разработка (dev)
    server: {
      port: 3000, // Порт
      host: "localhost", // Доступ: localhost (или true для 0.0.0.0)
      open: true, // Открывать браузер при запуске
      cors: true, // Включить CORS
      strictPort: false, // Не падать, если порт занят — попробовать следующий
      hmr: {
        overlay: true, // Показывать ошибки поверх приложения
      },
      // Прокси (если есть бэкенд)
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:8000',
      //     changeOrigin: true,
      //     secure: false,
      //   },
      // },
    },

    // 📦 Сборка (build)
    build: {
      outDir: "dist", // Куда собирать
      assetsDir: "assets", // Подпапка для ассетов
      sourcemap: mode === "development", // Sourcemaps только в dev
      minify: mode === "production", // Минификация только в prod
      cssMinify: mode === "production",
      target: "es2020", // Целевая версия JavaScript
      rollupOptions: {
        output: {
          // Контроль имён чанков
          chunkFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          // Разделение вендоров
          manualChunks: {
            vendor: ["react", "react-dom"],
            // utils: ['lodash', 'zod'],
          },
        },
      },
      emptyOutDir: true, // Очищать папку перед сборкой
    },

    // 🔍 Оптимизация зависимостей
    optimizeDeps: {
      include: [
        // Ускоряет старт dev-сервера
        "react",
        "react-dom",
        "react-router-dom",
      ],
    },

    // 🛠 TypeScript
    esbuild: {
      // esbuild обрабатывает .ts, .tsx
      jsxInject: mode === "development" ? `import React from 'react'` : "", // если не используешь автоматический JSX (React 17+)
      logOverride: { "missing-deps": "silent" },
    },

    // 🧪 Тестирование (если используешь Vitest)
    // test: {
    //   globals: true,
    //   environment: 'jsdom',
    //   setupFiles: './src/setupTests.ts',
    //   include: ['**/*.test.{ts,tsx}'],
    // },
  };
});
