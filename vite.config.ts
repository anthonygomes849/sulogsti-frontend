import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
  // base: './' // Caminho relativo para servir os arquivos
})
