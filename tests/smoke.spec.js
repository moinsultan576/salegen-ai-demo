// Smoke tests — run from the tests/ folder:  npm install && npx playwright install chromium && npm test
const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 1440, height: 900 } });

test.beforeEach(async ({ page }) => {
  await page.route('**/api/chat', r => r.fulfill({ status: 503, body: '{}' })); // use built-in replies
  await page.goto('/#/');
  await page.evaluate(() => localStorage.clear());
});

test('landing page renders in all 3 languages', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.locator('.hero h1')).toContainText('AI Sales Agent');
  await page.click('[data-act=lang][data-v=ar]');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.click('[data-act=lang][data-v=ur]');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ur');
});

test('login opens the CRM dashboard', async ({ page }) => {
  await page.goto('/#/login');
  await page.click('button[type=submit]');
  await expect(page.locator('.kpi')).toHaveCount(5);
  await expect(page.locator('.kcol')).toHaveCount(5);
});

test('drag a lead to Closed updates revenue', async ({ page }) => {
  await page.goto('/#/app/dashboard');
  const before = await page.locator('.kpi .v').nth(4).innerText();
  await page.locator('.kcard[data-id=l1]').scrollIntoViewIfNeeded();
  const src = await page.locator('.kcard[data-id=l1]').boundingBox();
  const dst = await page.locator('.kbody[data-stage=won]').boundingBox();
  await page.mouse.move(src.x + src.width / 2, src.y + 20);
  await page.mouse.down();
  await page.mouse.move(dst.x + dst.width / 2, dst.y + 60, { steps: 12 });
  await page.mouse.up();
  await expect(page.locator('.kbody[data-stage=won] .kcard[data-id=l1]')).toBeVisible();
  await expect(page.locator('.kpi .v').nth(4)).not.toHaveText(before);
});

test('add a lead from the modal', async ({ page }) => {
  await page.goto('/#/app/leads');
  await page.click('[data-act=newlead]');
  await page.fill('#mf [name=name]', 'Playwright Test');
  await page.click('[data-act=submit]');
  await expect(page.locator('#lbody')).toContainText('Playwright Test');
});

test('AI agent replies to a customer message', async ({ page }) => {
  await page.goto('/#/agent/chat/c1');
  const n = await page.locator('.msg.out').count();
  await page.fill('#compose', 'What are your prices?');
  await page.press('#compose', 'Enter');
  await expect(page.locator('.msg.out')).toHaveCount(n + 1, { timeout: 8000 });
  await expect(page.locator('.msg.out').last()).toContainText('499');
});

test('booking a meeting adds it to the calendar', async ({ page }) => {
  await page.goto('/#/agent/chat/c1');
  await page.fill('#compose', 'Book a call tomorrow');
  await page.press('#compose', 'Enter');
  await expect(page.locator('.msg.sys').last()).toBeVisible({ timeout: 8000 });
  await page.goto('/#/app/calendar');
  await expect(page.locator('.ev.g')).toHaveCount(1);
});
