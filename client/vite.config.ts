import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: '.', // Use the root directory
  build: {
    outDir: 'dist/client', // Output into dist/client folder
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // Correct entry point
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Aliases for cleaner imports
    },
  },
});
