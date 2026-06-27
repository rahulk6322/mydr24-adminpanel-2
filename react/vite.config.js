import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// MyDR24 HOS — Vite configuration
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1200,
  },
});
