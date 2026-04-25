import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: 'src/frontend/web/renderer',
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/frontend/web/renderer'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@api': path.resolve(__dirname, './src/backend/presentation/api'),
    },
  },
  build: {
    outDir: '../../../../dist/renderer',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});
