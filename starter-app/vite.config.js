import dotenv from 'dotenv';
dotenv.config();

import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

const { PORT = 3001 } = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    proxy: {
      '*': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
    },
    hmr: true
  },
  build: {
    outDir: 'dist/public',
    rollupOptions: {
      input: {
        main: 'src/app/main.tsx',
      },
      output: {
        format: 'system', // Output as SystemJS modules
        dir: 'dist/public', // Ensure output goes to the correct directory
        entryFileNames: '[name].js', // Control the output file name
        chunkFileNames: '[name]-[hash].js', // For chunks, add a hash to avoid collisions
        manualChunks: undefined, // Optional: Prevent automatic chunk splitting if you want everything in one file
      },
    },
    emptyOutDir: false
  },
});
