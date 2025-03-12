import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
  },
  // Ensure environment variables are properly loaded
  envDir: '.',
  // Add base path if deploying to a subdirectory
  // base: './'
});