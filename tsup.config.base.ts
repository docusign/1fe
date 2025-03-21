import { defineConfig } from 'tsup';

// https://tsup.egoist.dev/
export const baseConfig = defineConfig({
  // keep test files from output
  // keep all transpiled files to dist, this helps with deep imports
  entry: ['src/index.ts'],
  // clean output directory before each build
  clean: true,
  dts: true,
  treeshake: true,
  // by default tsup will exclude monorepo dependencies
  // but we wish to bundle them
  // noExternal: [/@1fe/],
  // noExternal: [/(.*)/],
});
