import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';
import inject from '@rollup/plugin-inject';

export default defineConfig({
  root: './client', // Set the root to the client directory
  base: './', // Correct base path for assets in production
  plugins: [react()],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    outDir: '../dist/client', // Output directory for built files
    emptyOutDir: true, // Clear the output directory before building
    rollupOptions: {
      input: './client/index.html', // Correct entry point
      plugins: [
        polyfillNode(),
        inject({
          global: ['globalThis', 'global'],
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ],
    },
  },
});
