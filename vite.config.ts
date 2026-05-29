import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  // Указываем корневую директорию проекта
  root: path.resolve(__dirname, 'Frontend'),

  // Настройка сервера разработки
  server: {
    port: 3001,
    open: true,
  },

  // Настройка сборки
  build: {
    // Выходная папка относительно корня проекта
    outDir: path.resolve(__dirname, '../dist'),
    emptyOutDir: true,
  },
  // Алиасы для удобных импортов
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'Frontend'),
    },
  },
  plugins: [vue()],
});
