import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  use: {
    // This is where your frontend runs in dev
    baseURL: 'http://localhost:5181',
    headless: true,
  },
  // You can add more browsers later if you like
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
