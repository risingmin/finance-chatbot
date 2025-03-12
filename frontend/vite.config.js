import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
    emptyOutDir: true,
  },
  // Ensure environment variables are properly loaded
  envDir: '.',
  // Uncomment and set the base path for deployment
  base: '/',
  server: {
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: process.env.PORT || 5173, // you can replace this port with any port
  }
});