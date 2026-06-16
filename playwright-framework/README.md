# 🎭 Playwright Automation Framework

Enterprise-grade Playwright framework for [RahulShetty Academy Practice Page](https://rahulshettyacademy.com/AutomationPractice/).

---

## 📁 Project Structure

```
playwright-framework/
├── config/
│   └── browserstack.config.ts    # BrowserStack integration helper
├── hooks/
│   ├── fixtures.ts               # Custom fixtures (practicePage, screenshotOnFailure)
│   ├── globalSetup.ts            # Runs once BEFORE all tests
│   └── globalTeardown.ts         # Runs once AFTER all tests
├── pages/
│   ├── BasePage.ts               # Generic reusable actions (all pages extend this)
│   └── PracticePage.ts           # Page Object for the Practice Page
├── test-data/
│   └── practicePageData.ts       # All test data separated from scripts
├── tests/
│   ├── smoke/
│   │   └── formElements.spec.ts  # Sample Script 1 — Form elements
│   └── e2e/
│       └── advancedInteractions.spec.ts  # Sample Script 2 — Advanced interactions
├── utils/
│   └── helpers.ts                # Logger, retry, random data, env config
├── screenshots/                  # Auto-captured screenshots (gitignore)
├── reports/                      # HTML / JSON / JUnit reports (gitignore)
├── playwright.config.ts          # Master configuration
├── package.json
└── .env                          # Environment variables (gitignore)
```

---

## ⚙️ Setup

```bash
npm install
npx playwright install
```

Copy `.env` and fill in your values:
```bash
cp .env .env.local
```

---

## 🚀 Running Tests

### All tests
```bash
npm test
```

### By annotation / group
```bash
npm run test:smoke        # @smoke tagged tests only
npm run test:regression   # @regression tagged tests only
npm run test:e2e          # @e2e tagged tests only
```

### By browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:safari
```

### Parallel execution
```bash
npm run test:parallel     # 4 workers
npm run test:serial       # 1 worker (sequential)
```

### Batch / sharded execution (for CI split across machines)
```bash
npx playwright test --shard=1/4   # Machine 1 of 4
npx playwright test --shard=2/4   # Machine 2 of 4
npx playwright test --shard=3/4   # Machine 3 of 4
npx playwright test --shard=4/4   # Machine 4 of 4
```

### Headed mode
```bash
npm run test:headed
```

### BrowserStack
```bash
# 1. Set credentials in .env:
#    BROWSERSTACK_USERNAME=your_username
#    BROWSERSTACK_ACCESS_KEY=your_access_key
#    BROWSERSTACK=true
npm run test:browserstack
```

### View report
```bash
npm run report
```

---

## 🏷️ Annotations Reference

| Annotation        | Purpose                               |
|-------------------|---------------------------------------|
| `@smoke`          | Fast sanity tests — run on every PR   |
| `@regression`     | Full regression — run nightly         |
| `@e2e`            | End-to-end flows                      |
| `@group:forms`    | Logical group: form element tests     |
| `@group:advanced` | Logical group: advanced interactions  |

Run by annotation:
```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression"
npx playwright test --grep "@group:forms"
```

Exclude an annotation:
```bash
npx playwright test --grep-invert "@e2e"
```

---

## 🧩 Framework Features

| Feature               | Implementation |
|-----------------------|----------------|
| Page Object Model     | `pages/BasePage.ts` + `pages/PracticePage.ts` |
| Generic reusable code | `BasePage.ts` — click, fill, assert, table, alert helpers |
| Hooks                 | `hooks/fixtures.ts` (beforeEach via fixture), `globalSetup/Teardown.ts` |
| Screenshots           | Auto on failure (fixture) + manual `takeScreenshot()` in tests |
| Test data separation  | `test-data/practicePageData.ts` |
| Multi-browser         | `playwright.config.ts` projects: chromium, firefox, webkit, mobile |
| BrowserStack          | `config/browserstack.config.ts` + env flag `BROWSERSTACK=true` |
| Parallel execution    | `fullyParallel: true` + `--workers` flag |
| Batch execution       | `--shard=N/M` for splitting across CI machines |
| Group execution       | `--grep @smoke / @regression / @e2e` |
| Annotations           | `@smoke`, `@regression`, `@e2e`, `@group:*` tags in test names |
| Reporting             | HTML + JSON + JUnit (configured in `playwright.config.ts`) |
| Retry on failure      | `retries: 2` on CI |
| Video on failure      | `video: 'retain-on-failure'` |
| Trace on failure      | `trace: 'retain-on-failure'` |

---

## 🏗️ Adding a New Page

1. Create `pages/YourPage.ts` extending `BasePage`
2. Add selectors and high-level actions
3. Create `test-data/yourPageData.ts` for test data
4. Create `tests/smoke/yourPage.spec.ts` and/or `tests/e2e/yourPage.spec.ts`
5. Use the `practicePage` fixture pattern in `hooks/fixtures.ts` for your new page

---

## 🌐 BrowserStack Setup

1. Sign up at [browserstack.com](https://www.browserstack.com)
2. Get your **Username** and **Access Key** from the Automate dashboard
3. Set in `.env`:
   ```
   BROWSERSTACK=true
   BROWSERSTACK_USERNAME=your_username
   BROWSERSTACK_ACCESS_KEY=your_access_key
   ```
4. Run: `npm run test:browserstack`
