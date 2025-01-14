import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: [""],
  format: ["cjs", "esm"],
  external: ["react"],
  banner: {
    js: "'use client'",
  },
  ...options,
}));
