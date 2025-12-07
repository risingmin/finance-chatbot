import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1600,
    emptyOutDir: true
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    proxy: {
      '/api': {
        target: process.env.VITE_DEV_API_TARGET || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log(`[Vite Proxy] ${path} -> ${process.env.VITE_DEV_API_TARGET || 'http://localhost:8000'}${path}`);
          return path;
        }
      },
      '/health': {
        target: process.env.VITE_DEV_API_TARGET || 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    },
    cors: true
  },
  envPrefix: 'VITE_'
});