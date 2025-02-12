import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    rollupOptions: {
      external: ["react", "lodash"],
      input: "src/app2.tsx",
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
