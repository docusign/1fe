import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts', // Entry point for your package (usually the main file)
      name: 'MyLibrary', // Global name for your library (optional, for browser usage)
      fileName: 'index', // Output file name (without extension)
      formats: ['es'], // This ensures the output is in ESM format
    },
    rollupOptions: {
      // External dependencies you want to exclude from the build (e.g., React)
      external: ['react', 'react-dom'],

      output: {
        format: 'esm', // Enforces the ES module output
        entryFileNames: '[name].mjs', // Ensure the output is in ESM format
        chunkFileNames: '[name]-[hash].mjs', // Optional: add hashes for chunks
      },
    },
  },
});
