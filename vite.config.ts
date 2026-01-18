import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/lm-studio-api': {
            target: 'http://localhost:1234',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/lm-studio-api/, '')
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY),
        'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
