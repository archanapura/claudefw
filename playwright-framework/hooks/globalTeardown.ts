import { FullConfig } from '@playwright/test';

/**
 * globalTeardown.ts — runs ONCE after the entire test suite.
 * Configure via `globalTeardown` in playwright.config.ts.
 *
 * Common uses:
 *  - Clean up test data
 *  - Send report notifications (Slack, email)
 *  - Archive screenshots
 */
async function globalTeardown(config: FullConfig) {
  console.log('\n🧹 [Global Teardown] Running post-suite cleanup...');

  // Example: log summary
  console.log('  📊 Test suite complete. Check reports/ for HTML report.');

  // Example: send Slack notification (replace with real webhook)
  // await fetch(process.env.SLACK_WEBHOOK!, {
  //   method: 'POST',
  //   body: JSON.stringify({ text: '✅ Playwright suite finished. See report.' }),
  // });

  console.log('✅ [Global Teardown] Complete.\n');
}

export default globalTeardown;
