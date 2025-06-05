import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', // e2eディレクトリのみをテスト対象に
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3000', headless: false },
    },
    {
      name: 'chrome-mobile',
      use: { ...devices['Pixel 5'], baseURL: 'http://localhost:3000', headless: false },
    },
  ],
});
