import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // The server.proxy section is only for local development.
  // It will be ignored in production builds (like on Vercel).
  server: process.env.NODE_ENV === 'development' ? {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/comments': 'http://localhost:5000',
      '/profile': 'http://localhost:5000',
      '/auth': 'http://localhost:5000',
    },
  } : undefined,
});
