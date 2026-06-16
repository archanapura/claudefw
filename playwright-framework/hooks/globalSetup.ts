import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';

/**
 * globalSetup.ts — runs ONCE before the entire test suite.
 * Configure via `globalSetup` in playwright.config.ts.
 *
 * Common uses:
 *  - Perform login and save auth state to a file
 *  - Seed test data
 *  - Ensure screenshot/report directories exist
 */
async function globalSetup(config: FullConfig) {
  console.log('\n🚀 [Global Setup] Starting pre-suite setup...');

  // ─── Ensure output directories exist ──────────────────────────────────────
  const dirs = ['screenshots', 'screenshots/failures', 'reports', 'test-results'];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  ✅ Created directory: ${dir}`);
    }
  });

  // ─── (Optional) Auth setup — uncomment and adapt as needed ──────────────────
  // const browser = await chromium.launch();
  // const page = await browser.newPage();
  // await page.goto('https://yourapp.com/login');
  // await page.fill('#username', process.env.USERNAME!);
  // await page.fill('#password', process.env.PASSWORD!);
  // await page.click('#login-btn');
  // await page.context().storageState({ path: 'auth.json' });
  // await browser.close();
  // console.log('  ✅ Auth state saved to auth.json');

  console.log('✅ [Global Setup] Complete.\n');
}

export default globalSetup;
