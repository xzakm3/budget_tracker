import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: false, // Disable for database tests
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1, // Single worker for database tests
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'cd ../api && npm run test:setup && NODE_ENV=test npm run dev',
      port: 3001,
      timeout: 30000,
      reuseExistingServer: !process.env.CI,
      env: {
        NODE_ENV: 'test',
        DB_HOST: 'localhost',
        DB_PORT: '5432',
        DB_NAME: 'jumptech_db',
        DB_USER: 'jokeice',
        DB_PASSWORD: ''
      }
    },
    {
      command: 'npm run dev',
      port: 3000,
      timeout: 30000,
      reuseExistingServer: !process.env.CI,
    }
  ],
});