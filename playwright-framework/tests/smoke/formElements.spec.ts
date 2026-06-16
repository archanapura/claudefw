/**
 * tests/smoke/formElements.spec.ts
 *
 * Sample Script 1 — Form Elements on the Practice Page
 * Covers: Radio buttons, Dropdown, Checkboxes, Auto-suggest
 *
 * Annotations used:
 *  @smoke  — included in the fast smoke suite
 *  @regression — included in full regression run
 *  @group:forms — logical group for form-element tests
 *
 * Run this file:
 *   npx playwright test tests/smoke/formElements.spec.ts
 *   npx playwright test --grep @smoke
 */

import { test, expect } from '../../hooks/fixtures';
import {
  RadioData,
  DropdownData,
  CountryData,
  CheckboxData,
} from '../../test-data/practicePageData';

test.describe('@smoke @group:forms — Form Elements', () => {

  // ─── beforeEach: navigate to practice page ────────────────────────────────
  // Handled automatically by the `practicePage` fixture (already opens the URL)

  // ─── afterEach: screenshot on failure handled by screenshotOnFailure fixture

  // ════════════════════════════════════════════════════════════════════════════
  // Radio Button Tests
  // ════════════════════════════════════════════════════════════════════════════

  test.describe('Radio Buttons', () => {

    test('@smoke select Radio1 and verify it is checked', async ({ practicePage }) => {
      await practicePage.selectRadio('radio1');
      await practicePage.assertChecked(practicePage.radio1);
    });

    test('@smoke select Radio2 and verify Radio1 is unchecked', async ({ practicePage }) => {
      await practicePage.selectRadio('radio1');
      await practicePage.selectRadio('radio2');
      await practicePage.assertChecked(practicePage.radio2);
      expect(await practicePage.isChecked(practicePage.radio1)).toBe(false);
    });

    test('@regression cycle through all radio options', async ({ practicePage }) => {
      for (const option of RadioData.validOptions) {
        await practicePage.selectRadio(option);
        const locatorMap = {
          radio1: practicePage.radio1,
          radio2: practicePage.radio2,
          radio3: practicePage.radio3,
        };
        await practicePage.assertChecked(locatorMap[option]);
        await practicePage.takeScreenshot(`radio-${option}`);
      }
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // Static Dropdown Tests
  // ════════════════════════════════════════════════════════════════════════════

  test.describe('Static Dropdown', () => {

    test('@smoke select Option1 from dropdown', async ({ practicePage }) => {
      await practicePage.chooseDropdownOption('Option1');
      await practicePage.assertValue(practicePage.staticDropdown, 'Option1');
    });

    test('@regression verify all dropdown options are present', async ({ practicePage }) => {
      const options = await practicePage.getDropdownOptions(practicePage.staticDropdown);
      // Filter out the default "Select" option
      const filteredOptions = options.filter((o) => o !== 'Select');
      expect(filteredOptions).toEqual(expect.arrayContaining(DropdownData.options));
    });

    for (const option of DropdownData.options) {
      test(`@regression select dropdown option: ${option}`, async ({ practicePage }) => {
        await practicePage.chooseDropdownOption(option);
        await practicePage.assertValue(practicePage.staticDropdown, option);
      });
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // Auto-suggest / Country Search Tests
  // ════════════════════════════════════════════════════════════════════════════

  test.describe('Auto-suggest Country Search', () => {

    test('@smoke type "Ind" and select India', async ({ practicePage }) => {
      await practicePage.searchAndSelectCountry('Ind', 'India');
      await practicePage.assertValue(practicePage.countryInput, 'India');
    });

    for (const { partial, exact } of CountryData.searches) {
      test(`@regression search "${partial}" and select "${exact}"`, async ({ practicePage }) => {
        await practicePage.searchAndSelectCountry(partial, exact);
        await practicePage.assertValue(practicePage.countryInput, exact);
        await practicePage.takeScreenshot(`autosuggest-${exact.toLowerCase()}`);
      });
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // Checkbox Tests
  // ════════════════════════════════════════════════════════════════════════════

  test.describe('Checkboxes', () => {

    test('@smoke check Option1 and verify', async ({ practicePage }) => {
      await practicePage.checkCheckboxes(['option1']);
      await practicePage.assertChecked(practicePage.checkboxOption1);
    });

    test('@regression check multiple checkboxes simultaneously', async ({ practicePage }) => {
      await practicePage.checkCheckboxes(['option1', 'option2', 'option3']);
      await practicePage.assertChecked(practicePage.checkboxOption1);
      await practicePage.assertChecked(practicePage.checkboxOption2);
      await practicePage.assertChecked(practicePage.checkboxOption3);
      await practicePage.takeScreenshot('all-checkboxes-checked');
    });

    test('@regression options are independent', async ({ practicePage }) => {
      await practicePage.checkCheckboxes(['option2']);
      await practicePage.assertChecked(practicePage.checkboxOption2);
      expect(await practicePage.isChecked(practicePage.checkboxOption1)).toBe(false);
      expect(await practicePage.isChecked(practicePage.checkboxOption3)).toBe(false);
    });
  });
});
