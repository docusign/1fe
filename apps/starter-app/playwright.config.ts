import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3001/health',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120 * 1000,
  },
  maxFailures: 0,
  quiet: false,
  testDir: './src/__tests__/tests',
});
