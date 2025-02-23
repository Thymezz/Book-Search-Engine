import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: '.', // Use the root directory
  build: {
    outDir: 'dist/client', // Ensure it points here
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Aliases for cleaner imports
    },
  },
});
