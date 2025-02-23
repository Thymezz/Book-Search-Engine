import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'client', // Set root to client directory
  build: {
    outDir: '../dist', // Output to the main dist folder from client
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'), // Explicitly set entry point
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'), // Aliases for cleaner imports from client/src
    },
  },
});
