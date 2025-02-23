import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';
import inject from '@rollup/plugin-inject';

export default defineConfig({
  root: './client',
  base: './', // Use a relative path for assets in production
  plugins: [react()],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
    },
  },
  define: {
    'process.env': process.env,
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
    emptyOutDir: true,
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
