import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd());
  
  return {
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
        '/api': {
          target: 'https://finance-chatbot-api.onrender.com',
          changeOrigin: true,
          secure: true
        }
      }
    },
    // Make environment variables available to your app
    define: {
      // For compatibility with older code still using process.env
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'process.env.REACT_APP_API_URL': JSON.stringify(env.VITE_API_URL)
    }
  };
});