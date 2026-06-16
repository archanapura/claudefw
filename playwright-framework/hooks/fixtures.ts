import { test as base, Page, BrowserContext } from '@playwright/test';
import { PracticePage } from '../pages/PracticePage';
import * as fs from 'fs';
import * as path from 'path';

// ─── Custom fixture types ─────────────────────────────────────────────────────

type CustomFixtures = {
  practicePage: PracticePage;
  authenticatedPage: Page;
  screenshotOnFailure: void;
};

// ─── Extended test object with custom fixtures ────────────────────────────────

export const test = base.extend<CustomFixtures>({

  /**
   * Fixture: practicePage
   * Auto-navigates to the practice page and tears down after each test.
   */
  practicePage: async ({ page }, use) => {
    const practicePage = new PracticePage(page);
    await practicePage.open();
    await use(practicePage);
    // Teardown: nothing special needed; browser context is reset per test
  },

  /**
   * Fixture: authenticatedPage
   * Placeholder for tests that need a logged-in session.
   * Replace with real auth logic (cookies / storageState) as needed.
   */
  authenticatedPage: async ({ page }, use) => {
    // Example: restore auth state from file
    // await page.context().addCookies([...]);
    // or: browser.newContext({ storageState: 'auth.json' })
    console.log('[Hook] authenticatedPage fixture: apply auth state here');
    await use(page);
  },

  /**
   * Auto-fixture: screenshotOnFailure
   * Runs after every test and captures a screenshot if the test failed.
   */
  screenshotOnFailure: [
    async ({ page }, use, testInfo) => {
      await use();
      if (testInfo.status !== testInfo.expectedStatus) {
        const screenshotDir = path.resolve('screenshots/failures');
        if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
        const safeName = testInfo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filePath = path.join(screenshotDir, `${safeName}-${Date.now()}.png`);
        await page.screenshot({ path: filePath, fullPage: true });
        await testInfo.attach('failure-screenshot', { path: filePath, contentType: 'image/png' });
        console.log(`📸 Failure screenshot: ${filePath}`);
      }
    },
    { auto: true }, // auto = runs for every test without needing to declare it
  ],
});

// ─── Re-export expect so tests only import from this file ─────────────────────
export { expect } from '@playwright/test';
