import { defineConfig, type Options } from "tsup";
import { name } from "./package.json";

export default defineConfig((options: Options) => ({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  target: "ESNext",
  clean: true,
  splitting: true,
  banner: {
    js: `/* ${name} */`
  },
  ...options,
}));
