import { defineConfig, devices } from '@playwright/test';
import { EnvConfig } from './web/src/config/env.config';

const htmlReportDir = process.env.HTML_REPORT_DIR || 'reports/html';

// Workers resolution: CLI override > PARALLEL switch > EnvConfig.PARALLEL_WORKERS > undefined
const resolveWorkers = (): number | undefined => {
  if (process.env.WORKERS) {
    return parseInt(process.env.WORKERS, 10);
  }
  if (process.env.PARALLEL === 'true') {
    return EnvConfig.PARALLEL_WORKERS;
  }
  return undefined;
};

export default defineConfig({
  testDir: './web/tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: EnvConfig.RETRIES,
  workers: resolveWorkers(),
  timeout: 60000,
  outputDir: 'test-results',
  expect: {
    timeout: 15000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: htmlReportDir, open: 'never' }],
    ['json', { outputFile: `${htmlReportDir}/playwright-results.json` }],
  ],
  use: {
    baseURL: EnvConfig.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: { mode: 'only-on-failure', fullPage: true },
    video: 'retain-on-failure',
    headless: EnvConfig.HEADLESS,
    viewport: { width: 1280, height: 720 },
    actionTimeout: EnvConfig.TIMEOUT.ELEMENT,
    navigationTimeout: EnvConfig.TIMEOUT.PAGE_LOAD,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
