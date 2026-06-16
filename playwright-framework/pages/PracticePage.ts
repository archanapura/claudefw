import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * PracticePage — Page Object for
 * https://rahulshettyacademy.com/AutomationPractice/
 */
export class PracticePage extends BasePage {
  readonly url: string;

  // ─── Radio Buttons ───────────────────────────────────────────────────────────
  readonly radio1: Locator;
  readonly radio2: Locator;
  readonly radio3: Locator;

  // ─── Suggestion / Auto-complete ──────────────────────────────────────────────
  readonly countryInput: Locator;
  readonly suggestionList: Locator;

  // ─── Static Dropdown ─────────────────────────────────────────────────────────
  readonly staticDropdown: Locator;

  // ─── Checkboxes ──────────────────────────────────────────────────────────────
  readonly checkboxOption1: Locator;
  readonly checkboxOption2: Locator;
  readonly checkboxOption3: Locator;

  // ─── Switch Window ───────────────────────────────────────────────────────────
  readonly openWindowBtn: Locator;

  // ─── Switch Tab ──────────────────────────────────────────────────────────────
  readonly openTabLink: Locator;

  // ─── Alert ───────────────────────────────────────────────────────────────────
  readonly alertNameInput: Locator;
  readonly alertBtn: Locator;
  readonly confirmBtn: Locator;

  // ─── Web Table ───────────────────────────────────────────────────────────────
  readonly courseTable: Locator;
  readonly fixedHeaderTable: Locator;
  readonly totalAmountText: Locator;

  // ─── Hide / Show ─────────────────────────────────────────────────────────────
  readonly hideBtn: Locator;
  readonly showBtn: Locator;
  readonly hiddenInput: Locator;

  // ─── Mouse Hover ─────────────────────────────────────────────────────────────
  readonly mouseHoverBtn: Locator;
  readonly hoverTopLink: Locator;
  readonly hoverReloadLink: Locator;

  // ─── iFrame ──────────────────────────────────────────────────────────────────
  readonly iFrame: Locator;

  constructor(page: Page) {
    super(page);
    this.url = '/AutomationPractice/';

    // Radios
    this.radio1 = page.locator('input[value="radio1"]');
    this.radio2 = page.locator('input[value="radio2"]');
    this.radio3 = page.locator('input[value="radio3"]');

    // Suggestion
    this.countryInput = page.locator('#autocomplete');
    this.suggestionList = page.locator('.ui-menu-item');

    // Dropdown
    this.staticDropdown = page.locator('#dropdown-class-example');

    // Checkboxes
    this.checkboxOption1 = page.locator('input[value="option1"]');
    this.checkboxOption2 = page.locator('input[value="option2"]');
    this.checkboxOption3 = page.locator('input[value="option3"]');

    // Window / Tab
    this.openWindowBtn = page.locator('#openwindow');
    this.openTabLink = page.locator('#opentab');

    // Alert
    this.alertNameInput = page.locator('#name');
    this.alertBtn = page.locator('#alertbtn');
    this.confirmBtn = page.locator('#confirmbtn');

    // Tables
    this.courseTable = page.locator('.tableFixHead table').first();
    this.fixedHeaderTable = page.locator('.tableFixHead table').nth(1);
    this.totalAmountText = page.locator('#sectionOne').filter({ hasText: 'Total Amount' });

    // Hide/Show
    this.hideBtn = page.locator('#hide-textbox');
    this.showBtn = page.locator('#show-textbox');
    this.hiddenInput = page.locator('#displayed-text');

    // Mouse Hover
    this.mouseHoverBtn = page.locator('#mousehover');
    this.hoverTopLink = page.locator('.mouse-hover-content a', { hasText: 'Top' });
    this.hoverReloadLink = page.locator('.mouse-hover-content a', { hasText: 'Reload' });

    // iFrame
    this.iFrame = page.locator('iframe');
  }

  // ─── High-level actions ───────────────────────────────────────────────────────

  async open(): Promise<void> {
    await this.navigate(this.url);
    await this.assertTitle(/Practice Page/);
  }

  async selectRadio(option: 'radio1' | 'radio2' | 'radio3'): Promise<void> {
    const map = { radio1: this.radio1, radio2: this.radio2, radio3: this.radio3 };
    await this.click(map[option]);
  }

  async searchAndSelectCountry(countryPartial: string, exactMatch: string): Promise<void> {
    await this.fill(this.countryInput, countryPartial);
    await this.page.waitForSelector('.ui-menu-item', { state: 'visible' });
    const suggestion = this.suggestionList.filter({ hasText: exactMatch });
    await this.click(suggestion);
  }

  async chooseDropdownOption(value: string): Promise<void> {
    await this.selectOption(this.staticDropdown, value);
  }

  async checkCheckboxes(options: ('option1' | 'option2' | 'option3')[]): Promise<void> {
    const map = {
      option1: this.checkboxOption1,
      option2: this.checkboxOption2,
      option3: this.checkboxOption3,
    };
    for (const option of options) {
      await this.check(map[option]);
    }
  }

  async triggerAlert(name: string): Promise<string> {
    await this.fill(this.alertNameInput, name);
    const alertText = await this.getAlertText();
    await this.click(this.alertBtn);
    return alertText;
  }

  async triggerConfirmAndAccept(name: string): Promise<string> {
    await this.fill(this.alertNameInput, name);
    const alertText = await this.getAlertText();
    await this.click(this.confirmBtn);
    return alertText;
  }

  async hideTextField(): Promise<void> {
    await this.click(this.hideBtn);
  }

  async showTextField(): Promise<void> {
    await this.click(this.showBtn);
  }

  async hoverAndClickTop(): Promise<void> {
    await this.hover(this.mouseHoverBtn);
    await this.click(this.hoverTopLink);
  }

  async hoverAndClickReload(): Promise<void> {
    await this.hover(this.mouseHoverBtn);
    await this.click(this.hoverReloadLink);
  }

  async openNewWindow(): Promise<Page> {
    return this.clickAndGetNewPage(this.openWindowBtn);
  }

  async openNewTab(): Promise<Page> {
    return this.clickAndGetNewPage(this.openTabLink);
  }

  async getCoursePriceByName(courseName: string): Promise<string> {
    const row = await this.findTableRowByText(this.courseTable, courseName);
    if (!row) throw new Error(`Course "${courseName}" not found in table`);
    const cells = row.locator('td');
    return ((await cells.nth(2).textContent()) ?? '').trim();
  }

  async getTotalAmount(): Promise<number> {
    const text = await this.getText(this.totalAmountText);
    const match = text.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  async getFrameHeading(): Promise<string> {
    const frame = this.page.frameLocator('iframe');
    return (await frame.locator('h2').first().textContent()) ?? '';
  }
}
