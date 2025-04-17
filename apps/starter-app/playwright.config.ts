import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3002',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 15 * 1000,
  },
  testDir: './src/__tests__/tests',
});
