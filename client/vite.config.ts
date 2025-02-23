import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: '.', // Use the root directory
  build: {
    outDir: 'dist/client', // Output client build here
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // Set entry point
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
