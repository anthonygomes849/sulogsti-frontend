import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      services: path.resolve(__dirname, './src/services'),

    },
  },
  server: {
    proxy: {
      '/operacaopatio': {
        target: 'https://api2.sulog.com.br',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist', // Saída do build será na pasta dist
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
  // base: './' // Caminho relativo para servir os arquivos
})
