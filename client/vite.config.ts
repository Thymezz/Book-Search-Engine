import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig({
  root: './client',
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
      external: [], // Ensure no external packages are excluded from the build
    },
  },
});
