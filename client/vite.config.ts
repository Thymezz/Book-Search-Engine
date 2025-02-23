import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';
import inject from '@rollup/plugin-inject';

export default defineConfig({
  root: './client', // Set the root to the client directory
  base: '/', // Set the base path for assets correctly for deployment
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
    outDir: '../dist/client',
    rollupOptions: {
      input: './client/index.html',
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
