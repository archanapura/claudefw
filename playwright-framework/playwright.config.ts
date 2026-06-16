import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const isBrowserStack = process.env.BROWSERSTACK === 'true';

/**
 * BrowserStack capabilities builder
 */
const buildBrowserStackProject = (browserName: string, os: string, osVersion: string) => ({
  name: `BS-${browserName}-${os}`,
  use: {
    connectOptions: {
      wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
        JSON.stringify({
          browser: browserName.toLowerCase(),
          os,
          os_version: osVersion,
          name: `Playwright Test - ${browserName}`,
          build: `Build-${Date.now()}`,
          'browserstack.username': process.env.BROWSERSTACK_USERNAME,
          'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
          'browserstack.networkLogs': true,
          'browserstack.consoleLogs': 'verbose',
        })
      )}`,
    },
  },
});

export default defineConfig({
  // ─── Global test settings ──────────────────────────────────────────────────
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,

  // ─── Reporters ─────────────────────────────────────────────────────────────
  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['list'],
  ],

  // ─── Shared settings for all tests ─────────────────────────────────────────
  use: {
    baseURL: process.env.BASE_URL || 'https://rahulshettyacademy.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    headless: process.env.HEADLESS !== 'false',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  // ─── Output directory ───────────────────────────────────────────────────────
  outputDir: 'test-results',

  // ─── Projects: Local browsers ──────────────────────────────────────────────
  projects: isBrowserStack
    ? [
        // BrowserStack cloud browsers
        buildBrowserStackProject('chrome', 'Windows', '11'),
        buildBrowserStackProject('edge', 'Windows', '11'),
        buildBrowserStackProject('safari', 'OS X', 'Ventura'),
        buildBrowserStackProject('firefox', 'Windows', '11'),
      ]
    : [
        // Local browsers
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
          use: { ...devices['iPhone 13'] },
        },
        // Smoke tests run only on Chromium for speed
        {
          name: 'smoke',
          grep: /@smoke/,
          use: { ...devices['Desktop Chrome'] },
        },
        // Regression runs on Chrome + Firefox
        {
          name: 'regression-chrome',
          grep: /@regression/,
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'regression-firefox',
          grep: /@regression/,
          use: { ...devices['Desktop Firefox'] },
        },
      ],
});
