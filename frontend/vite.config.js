import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Determine the base path from environment or use relative path
const base = process.env.BASE_PATH || '/';

// Simplified index.html finder
const findIndexHtml = () => {
  const possiblePaths = [
    resolve(__dirname, 'public/index.html'),
    resolve(__dirname, 'index.html'),
    resolve(process.cwd(), 'public/index.html'),
    resolve(process.cwd(), 'index.html')
  ];
  
  for (const path of possiblePaths) {
    if (fs.existsSync(path)) {
      console.log(`Found index.html at: ${path}`);
      return path;
    }
  }
  
  console.warn('index.html not found in expected locations!');
  return resolve(__dirname, 'public/index.html'); 
};

export default defineConfig({
  plugins: [
    react({
      // Make sure React works correctly in production
      jsxRuntime: 'automatic',
      babel: {
        // Add proper Babel plugins if needed
        plugins: []
      }
    })
  ],
  resolve: {
    alias: {
      // Add any path aliases you need
    }
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: true, // Keep sourcemaps for debugging
    emptyOutDir: true,
    // Use more compatible build settings
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari13'],
    rollupOptions: {
      input: {
        main: findIndexHtml()
      },
      output: {
        // Use named chunks for better debugging
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  base: base,
  server: {
    host: true,
    strictPort: true,
    port: process.env.PORT || 5173,
  },
  // Add clear console.log for build progress
  logLevel: 'info'
});