import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Determine the base path from environment or use relative path
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
    emptyOutDir: true,
    // Add target for better browser compatibility
    target: 'es2015',
    // Configure chunk size policy
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // Ensure environment variables are properly loaded
  envDir: '.',
  // Set base path dynamically
  base: base,
  server: {
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: process.env.PORT || 5173, // you can replace this port with any port
  }
});