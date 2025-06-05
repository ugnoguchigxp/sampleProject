import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;
export default defineConfig({
  testDir: './E2E',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chrome',
      use: { browserName: 'chromium', channel: 'chrome' },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'], browserName: 'chromium' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    cwd: './frontend',
    port: PORT,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
