import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Determine the base path from environment or use relative path
const base = process.env.BASE_PATH || '/';

// Try to find index.html in multiple possible locations
const findIndexHtml = () => {
  const possiblePaths = [
    resolve(__dirname, 'index.html'),
    resolve(__dirname, 'public/index.html'),
    resolve(__dirname, '../index.html'),
    resolve(process.cwd(), 'index.html'),
    resolve(process.cwd(), 'public/index.html')
  ];
  
  for (const path of possiblePaths) {
    if (fs.existsSync(path)) {
      console.log(`Found index.html at: ${path}`);
      return path;
    }
  }
  
  console.warn('index.html not found in expected locations!');
  return resolve(__dirname, 'index.html'); // fallback to default
};

// Custom plugin to handle malformed URIs in HTML
const htmlSanitizer = () => {
  return {
    name: 'html-sanitizer',
    enforce: 'pre',
    transformIndexHtml(html) {
      try {
        // Basic sanitization for common URI issues
        return html
          // Fix common URI encoding issues
          .replace(/%(?![0-9A-Fa-f]{2})/g, '%25')
          // Handle problematic characters in URLs
          .replace(/(\bhref=["']|\bsrc=["'])[^"'\s>]*(%(?![0-9A-Fa-f]{2})|[^\w\-.~:/?#\[\]@!$&'()*+,;=])/g, (match, prefix, badChar) => {
            const url = match.slice(prefix.length);
            try {
              return prefix + encodeURI(decodeURI(url));
            } catch (e) {
              // If decoding fails, manually encode the URL
              return prefix + encodeURI(url);
            }
          });
      } catch (e) {
        console.warn('Error sanitizing HTML:', e);
        return html; // Return original if sanitization fails
      }
    }
  };
};

export default defineConfig({
  plugins: [
    htmlSanitizer(), // Add this plugin before react()
    react()
  ],
  // Specify the project root directory
  root: process.cwd(),
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
      input: {
        main: findIndexHtml()
      },
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