/**
 * tests/e2e/advancedInteractions.spec.ts
 *
 * Sample Script 2 — Advanced Page Interactions
 * Covers: Alerts, Web Tables, Hide/Show, Mouse Hover, iFrame, New Window/Tab
 *
 * Annotations:
 *  @e2e        — end-to-end full-flow tests
 *  @regression — regression suite
 *  @group:advanced — advanced interaction group
 *
 * Run this file:
 *   npx playwright test tests/e2e/advancedInteractions.spec.ts
 *   npx playwright test --grep @e2e
 */

import { test, expect } from '../../hooks/fixtures';
import { AlertData, TableData, WindowData, PageData } from '../../test-data/practicePageData';

test.describe('@e2e @group:advanced — Advanced Interactions', () => {

  // ════════════════════════════════════════════════════════════════════════════
  // Alert Tests
  // ════════════════════════════════════════════════════════════════════════════

  test.describe('Alerts', () => {

    test('@e2e trigger JS alert and verify message contains name', async ({ practicePage }) => {
      const name = AlertData.validName;
      // Register alert listener before clicking
      let alertMessage = '';
      practicePage['page'].once('dialog', async (dialog) => {
        alertMessage = dialog.message();
        await dialog.accept();
      });
      await practicePage.fill(practicePage.alertNameInput, name);
      await practicePage.click(practicePage.alertBtn);
      // Brief wait for dialog handler to fire
      await practicePage['page'].waitForTimeout(300);
      expect(alertMessage).toContain(name);
      await practicePage.takeScreenshot('alert-triggered');
    });

    test('@regression trigger Confirm dialog and accept', async ({ practicePage }) => {
      let dialogMessage = '';
      practicePage['page'].once('dialog', async (dialog) => {
        dialogMessage = dialog.message();
        await dialog.accept();
      });
      await practicePage.fill(practicePage.alertNameInput, AlertData.validName);
      await practicePage.click(practicePage.confirmBtn);
      await practicePage['page'].waitForTimeout(300);
      expect(dialogMessage).toContain(AlertData.validName);
    });

    test('@regression trigger Confirm dialog and dismiss', async ({ practicePage }) => {
      practicePage['page'].once('dialog', async (dialog) => {
        await dialog.dismiss();
      });
      await practicePage.fill(practicePage.alertNameInput, AlertData.validName);
      await practicePage.click(practicePage.confirmBtn);
      await practicePage['page'].waitForTimeout(300);
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // Web Table Tests
  // ════════════════════════════════════════════════════════════════════════════

  test.describe('Web Tables', () => {

    test('@e2e verify course prices in the course table', async ({ practicePage }) => {
      for (const { name, price } of TableData.expectedCourses) {
        const actualPrice = await practicePage.getCoursePriceByName(name);
        expect(actualPrice).toBe(price);
      }
      await practicePage.takeScreenshot('course-table-verified');
    });

    test('@regression verify total amount in fixed-header table', async ({ practicePage }) => {
      const total = await practicePage.getTotalAmount();
      expect(total).toBe(TableData.expectedTotalAmount);
    });

    test('@regression verify fixed-header table headers', async ({ practicePage }) => {
      const headers = practicePage.fixedHeaderTable.locator('th');
      const count = await headers.count();
      expect(count).toBe(TableData.expectedHeaders.length);
      for (let i = 0; i < count; i++) {
        const text = ((await headers.nth(i).textContent()) ?? '').trim();
        expect(text).toBe(TableData.expectedHeaders[i]);
      }
    });

    test('@regression verify specific rows in fixed-header table', async ({ practicePage }) => {
      for (const { name, position, city, amount } of TableData.expectedRows) {
        const row = await practicePage.findTableRowByText(practicePage.fixedHeaderTable, name);
        expect(row).not.toBeNull();
        const cells = row!.locator('td');
        expect(((await cells.nth(0).textContent()) ?? '').trim()).toBe(name);
        expect(((await cells.nth(1).textContent()) ?? '').trim()).toBe(position);
        expect(((await cells.nth(2).textContent()) ?? '').trim()).toBe(city);
        expect(((await cells.nth(3).textContent()) ?? '').trim()).toBe(amount);
      }
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // Hide / Show Tests
  // ════════════════════════════════════════════════════════════════════════════

  test.describe('Hide and Show Element', () => {

    test('@e2e hide text field and verify it is hidden', async ({ practicePage }) => {
      await practicePage.hideTextField();
      await practicePage.waitForHidden(practicePage.hiddenInput);
      expect(await practicePage.isVisible(practicePage.hiddenInput)).toBe(false);
      await practicePage.takeScreenshot('textfield-hidden');
    });

    test('@e2e hide then show text field', async ({ practicePage }) => {
      await practicePage.hideTextField();
      await practicePage.waitForHidden(practicePage.hiddenInput);
      await practicePage.showTextField();
      await practicePage.waitForVisible(practicePage.hiddenInput);
      expect(await practicePage.isVisible(practicePage.hiddenInput)).toBe(true);
      await practicePage.takeScreenshot('textfield-shown');
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // Mouse Hover Tests
  // ════════════════════════════════════════════════════════════════════════════

  test.describe('Mouse Hover', () => {

    test('@e2e hover over button and click Top link', async ({ practicePage }) => {
      await practicePage.scrollToElement(practicePage.mouseHoverBtn);
      await practicePage.hover(practicePage.mouseHoverBtn);
      await practicePage.assertVisible(practicePage.hoverTopLink);
      await practicePage.takeScreenshot('mouse-hover-menu-visible');
    });

    test('@regression hover and click Reload link', async ({ practicePage }) => {
      await practicePage.scrollToElement(practicePage.mouseHoverBtn);
      await practicePage.hoverAndClickReload();
      // After reload the page should return to practice page
      await practicePage.assertTitle(/Practice Page/);
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // New Window Tests
  // ════════════════════════════════════════════════════════════════════════════

  test.describe('Switch Window', () => {

    test('@e2e open new window and verify URL', async ({ practicePage }) => {
      const newPage = await practicePage.openNewWindow();
      expect(newPage.url()).toContain(WindowData.expectedWindowUrl);
      await newPage.close();
      await practicePage.takeScreenshot('new-window-opened');
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // New Tab Tests
  // ════════════════════════════════════════════════════════════════════════════

  test.describe('Switch Tab', () => {

    test('@e2e open new tab and verify URL', async ({ practicePage }) => {
      const newTab = await practicePage.openNewTab();
      expect(newTab.url()).toContain(WindowData.expectedTabUrl);
      await newTab.close();
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // iFrame Tests
  // ════════════════════════════════════════════════════════════════════════════

  test.describe('iFrame', () => {

    test('@e2e verify iFrame is present on the page', async ({ practicePage }) => {
      await practicePage.scrollToElement(practicePage.iFrame);
      await practicePage.assertVisible(practicePage.iFrame);
      await practicePage.takeScreenshot('iframe-visible');
    });

    test('@regression read heading text inside iFrame', async ({ practicePage }) => {
      const heading = await practicePage.getFrameHeading();
      expect(heading.length).toBeGreaterThan(0);
      console.log(`iFrame heading: ${heading}`);
    });
  });
});
