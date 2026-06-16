/**
 * config/browserstack.config.ts
 *
 * BrowserStack integration helper.
 * To use: set BROWSERSTACK=true in .env and fill in credentials.
 *
 * Docs: https://www.browserstack.com/docs/automate/playwright
 */

export interface BrowserStackCapabilities {
  browser: string;
  browser_version?: string;
  os: string;
  os_version: string;
  name: string;
  build: string;
  project?: string;
  'browserstack.username': string;
  'browserstack.accessKey': string;
  'browserstack.networkLogs'?: boolean;
  'browserstack.consoleLogs'?: string;
  'browserstack.video'?: boolean;
  'browserstack.debug'?: boolean;
}

const BUILD_NAME = `Playwright-Build-${new Date().toISOString().slice(0, 10)}`;
const PROJECT_NAME = 'RahulShetty Practice Automation';

/**
 * Build the BrowserStack WebSocket endpoint URL for a given browser/OS combo.
 */
export function getBrowserStackWsEndpoint(caps: BrowserStackCapabilities): string {
  const username = process.env.BROWSERSTACK_USERNAME!;
  const accessKey = process.env.BROWSERSTACK_ACCESS_KEY!;

  if (!username || !accessKey) {
    throw new Error(
      'BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY must be set in .env'
    );
  }

  const fullCaps: BrowserStackCapabilities = {
    ...caps,
    build: BUILD_NAME,
    project: PROJECT_NAME,
    'browserstack.username': username,
    'browserstack.accessKey': accessKey,
    'browserstack.networkLogs': true,
    'browserstack.consoleLogs': 'verbose',
    'browserstack.video': true,
    'browserstack.debug': true,
  };

  return `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
    JSON.stringify(fullCaps)
  )}`;
}

/**
 * Pre-defined BrowserStack browser configurations.
 */
export const BrowserStackBrowsers = {
  chromeWindows11: {
    browser: 'chrome',
    os: 'Windows',
    os_version: '11',
    name: 'Chrome on Windows 11',
    build: BUILD_NAME,
    'browserstack.username': '',
    'browserstack.accessKey': '',
  } as BrowserStackCapabilities,

  firefoxWindows11: {
    browser: 'firefox',
    os: 'Windows',
    os_version: '11',
    name: 'Firefox on Windows 11',
    build: BUILD_NAME,
    'browserstack.username': '',
    'browserstack.accessKey': '',
  } as BrowserStackCapabilities,

  safariMacVentura: {
    browser: 'safari',
    os: 'OS X',
    os_version: 'Ventura',
    name: 'Safari on macOS Ventura',
    build: BUILD_NAME,
    'browserstack.username': '',
    'browserstack.accessKey': '',
  } as BrowserStackCapabilities,

  edgeWindows11: {
    browser: 'edge',
    os: 'Windows',
    os_version: '11',
    name: 'Edge on Windows 11',
    build: BUILD_NAME,
    'browserstack.username': '',
    'browserstack.accessKey': '',
  } as BrowserStackCapabilities,
};
