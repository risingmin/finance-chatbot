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
      jsxRuntime: 'automatic',
      babel: {
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
    // Use esbuild minifier as a fallback if terser installation is problematic
    minify: process.env.USE_ESBUILD ? 'esbuild' : 'terser',
    sourcemap: true,
    emptyOutDir: true,
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari13'],
    rollupOptions: {
      input: {
        main: findIndexHtml()
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Make sure assets use relative paths
    assetsDir: 'assets',
  },
  base: '',
  server: {
    host: true,
    strictPort: true,
    port: process.env.PORT || 5173,
  },
  logLevel: 'info'
});