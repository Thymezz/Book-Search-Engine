import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';
import inject from '@rollup/plugin-inject';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig(({ mode }) => {
  // Load env variables
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
      'process.env': process.env,
      global: 'globalThis',
      'import.meta.env.VITE_GRAPHQL_URI': JSON.stringify(process.env.VITE_GRAPHQL_URI),
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
        input: './client/index.html', // Correct path
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
        plugins: [
          polyfillNode(),
          inject({
            global: ['globalThis', 'global'],
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
          }),
        ],
      }
    },
    server: {
      headers: {
        'Content-Type': 'application/javascript',
      },
    },
  };
});
