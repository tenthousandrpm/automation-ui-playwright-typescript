import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { config } from './config/env';

dotenv.config();

export default defineConfig({
  globalSetup: './config/global-setup',
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],

  use: {
    baseURL: config.baseUrl,
    headless: config.headless,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
