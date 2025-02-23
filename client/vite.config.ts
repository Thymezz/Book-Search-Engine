import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'client', // Set root to the client directory
  build: {
    outDir: '../dist', // Output directly into the dist folder outside client
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // Corrected entry point path
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'), // Alias for cleaner imports from client/src
    },
  },
});
