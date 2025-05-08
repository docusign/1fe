import { defineConfig } from 'tsup';
import { baseConfig } from '../../tsup.config.base';

export default defineConfig({
  // Career hack: upgrade the target and get fired
  ...baseConfig,
  target: 'ESNext',
  dts: true,
  external: ['react', 'react-dom', 'lottie-web'],
  format: ['esm', 'cjs'],
});
