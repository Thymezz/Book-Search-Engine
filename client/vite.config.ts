import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';
import inject from '@rollup/plugin-inject';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig(({ mode }) => {
  // ✅ Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: './client', // ✅ Set client root directory
    base: './', // ✅ Relative path for production assets
    plugins: [react()],
    resolve: {
      alias: {
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        buffer: 'buffer',
      },
    },
    define: {
      'process.env': process.env, // ✅ Environment variables
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
      outDir: '../dist/client', // ✅ Output build folder
      emptyOutDir: true, // ✅ Clear old builds
      rollupOptions: {
        input: './client/index.html', // ✅ Entry point
        output: {
          entryFileNames: 'assets/[name]-[hash].js', // ✅ Cache busting with hashes
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
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
    server: {
      headers: {
        'Content-Type': 'application/javascript', // ✅ Ensure JS files served correctly
      },
      open: true, // ✅ Automatically open browser on dev start
      port: 3000, // ✅ Set port for local development
    },
  };
});
