import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    host: '127.0.0.1'
  },
  build: {
    rollupOptions: {
      external: ["react", "lodash"],
      input: "src/widget.ts",
      preserveEntrySignatures: "strict",
      output: {
        format: "systemjs",
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
        globals: {
          lodash: "_",
          react: "react"
        },
      },
    },
  },
});
