import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';
import inject from '@rollup/plugin-inject';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
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
      'import.meta.env': env, // Correct way to inject environment variables for Vite
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
  };
});
