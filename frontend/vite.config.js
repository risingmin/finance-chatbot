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
    chunkSizeWarningLimit: 1600
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    proxy: {
      // Configure proxy for development
      '/api': {
        target: 'https://finance-chatbot-api.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  },
  // Make environment variables available
  define: {
    'process.env': process.env
  }
});