import { Page, Locator, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * BasePage — every page object extends this.
 * Centralises waits, assertions, and screenshot utilities.
 */
export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ─── Navigation ─────────────────────────────────────────────────────────────

  async navigate(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  // ─── Element interactions ────────────────────────────────────────────────────

  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fill(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(text);
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  async check(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.check();
  }

  async hover(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.hover();
  }

  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent()) ?? '';
  }

  async getInputValue(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return locator.inputValue();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async isEnabled(locator: Locator): Promise<boolean> {
    return locator.isEnabled();
  }

  async isChecked(locator: Locator): Promise<boolean> {
    return locator.isChecked();
  }

  // ─── Waits ───────────────────────────────────────────────────────────────────

  async waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForHidden(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForUrl(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }

  // ─── Alerts ─────────────────────────────────────────────────────────────────

  async acceptAlert(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
  }

  async dismissAlert(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.dismiss());
  }

  async getAlertText(): Promise<string> {
    return new Promise((resolve) => {
      this.page.once('dialog', async (dialog) => {
        resolve(dialog.message());
        await dialog.accept();
      });
    });
  }

  // ─── Frames ─────────────────────────────────────────────────────────────────

  getFrame(nameOrUrl: string) {
    return this.page.frame({ name: nameOrUrl }) ?? this.page.frameLocator(`iframe[src*="${nameOrUrl}"]`);
  }

  // ─── Tabs / Windows ──────────────────────────────────────────────────────────

  async clickAndGetNewPage(triggerLocator: Locator): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      triggerLocator.click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }

  // ─── Screenshots ─────────────────────────────────────────────────────────────

  async takeScreenshot(name: string): Promise<string> {
    const screenshotDir = path.resolve('screenshots');
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(screenshotDir, `${name}-${timestamp}.png`);
    await this.page.screenshot({ path: filePath, fullPage: true });
    console.log(`📸 Screenshot saved: ${filePath}`);
    return filePath;
  }

  async takeElementScreenshot(locator: Locator, name: string): Promise<string> {
    const screenshotDir = path.resolve('screenshots');
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(screenshotDir, `${name}-element-${timestamp}.png`);
    await locator.screenshot({ path: filePath });
    console.log(`📸 Element screenshot saved: ${filePath}`);
    return filePath;
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  async assertVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  async assertText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toHaveText(expectedText);
  }

  async assertContainsText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }

  async assertValue(locator: Locator, value: string): Promise<void> {
    await expect(locator).toHaveValue(value);
  }

  async assertUrl(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  async assertTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  async assertCount(locator: Locator, count: number): Promise<void> {
    await expect(locator).toHaveCount(count);
  }

  async assertChecked(locator: Locator): Promise<void> {
    await expect(locator).toBeChecked();
  }

  async assertDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
  }

  // ─── Scroll ──────────────────────────────────────────────────────────────────

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  // ─── Table utilities ──────────────────────────────────────────────────────────

  async getTableData(tableLocator: Locator): Promise<string[][]> {
    const rows = tableLocator.locator('tr');
    const count = await rows.count();
    const data: string[][] = [];
    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('td, th');
      const cellCount = await cells.count();
      const rowData: string[] = [];
      for (let j = 0; j < cellCount; j++) {
        rowData.push(((await cells.nth(j).textContent()) ?? '').trim());
      }
      data.push(rowData);
    }
    return data;
  }

  async findTableRowByText(tableLocator: Locator, searchText: string): Promise<Locator | null> {
    const rows = tableLocator.locator('tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const rowText = await rows.nth(i).textContent();
      if (rowText?.includes(searchText)) return rows.nth(i);
    }
    return null;
  }

  // ─── Dropdown helpers ────────────────────────────────────────────────────────

  async getDropdownOptions(locator: Locator): Promise<string[]> {
    return locator.locator('option').allTextContents();
  }

  // ─── Auto-suggest helper ─────────────────────────────────────────────────────

  async typeAndSelectSuggestion(inputLocator: Locator, text: string, suggestionLocator: Locator): Promise<void> {
    await this.fill(inputLocator, text);
    await this.page.waitForTimeout(500); // let suggestions populate
    await this.click(suggestionLocator.first());
  }
}
