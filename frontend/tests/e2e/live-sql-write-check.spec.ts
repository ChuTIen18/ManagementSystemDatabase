import { test, expect, Page } from '@playwright/test';

const promoName = `E2E_SQL_FRONTEND_${Date.now()}`;
const STEP_DELAY_MS = 2000;

async function pauseForVisualCheck(page: Page, label: string) {
  console.log(`[VISUAL CHECK] ${label}`);
  await page.waitForTimeout(STEP_DELAY_MS);
}

test('live frontend creates promotion through real API and shows it from SQL-backed data', async ({ page }) => {
  test.setTimeout(120_000);

  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      const text = message.text();
      if (text.includes('/api/v1/auth/me') && text.includes('401')) {
        return;
      }
      if (text === 'Failed to load resource: the server responded with a status of 401 (Unauthorized)') {
        return;
      }
      consoleErrors.push(text);
    }
  });
  page.on('pageerror', (error) => {
    consoleErrors.push(error.message);
  });
  page.on('response', (response) => {
    if (response.status() === 401) {
      const url = response.url();
      if (url.includes('/api/v1/auth/me')) {
        return;
      }
      consoleErrors.push(`401 Unauthorized: ${response.request().method()} ${url}`);
    }
  });

  await page.goto('/login');
  await page.waitForLoadState('domcontentloaded');
  await expect(page.getByText('☕ Coffee House')).toBeVisible();
  await pauseForVisualCheck(page, 'Opened login page');

  const managerRoleButton = page.locator('button').filter({ hasText: 'Quản lý' }).first();
  await expect(managerRoleButton).toBeVisible({ timeout: 15_000 });
  await managerRoleButton.scrollIntoViewIfNeeded();
  await managerRoleButton.click({ force: true });
  await pauseForVisualCheck(page, 'Selected manager role');

  await page.getByPlaceholder('manager@coffee.local').fill('manager@coffee.local');
  await pauseForVisualCheck(page, 'Filled manager email');

  await page.getByPlaceholder('Nhập mật khẩu').fill('123456');
  await pauseForVisualCheck(page, 'Filled manager password');

  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await expect(page).toHaveURL(/\/manager$/);
  await pauseForVisualCheck(page, 'Logged in as manager');

  await page.goto('/promotions-management');
  await expect(page.getByRole('heading', { name: /Promotions Management/i })).toBeVisible();
  await pauseForVisualCheck(page, 'Opened promotions management page');

  await page.getByRole('button', { name: /Add Promotion/i }).click();
  await pauseForVisualCheck(page, 'Opened add promotion form');

  await page.locator('input[name="name"]').fill(promoName);
  await pauseForVisualCheck(page, 'Filled promotion name');

  await page.locator('select[name="discount_type"]').selectOption('percentage');
  await pauseForVisualCheck(page, 'Selected discount type');

  await page.locator('input[name="discount_value"]').fill('12');
  await pauseForVisualCheck(page, 'Filled discount value');

  await page.locator('input[name="min_order_amount"]').fill('0');
  await pauseForVisualCheck(page, 'Filled minimum order amount');

  await page.locator('input[name="max_discount_amount"]').fill('50000');
  await pauseForVisualCheck(page, 'Filled maximum discount amount');

  await page.locator('input[name="start_date"]').fill('2026-05-01');
  await pauseForVisualCheck(page, 'Filled start date');

  await page.locator('input[name="end_date"]').fill('2026-12-31');
  await pauseForVisualCheck(page, 'Filled end date');

  await page.locator('textarea[name="description"]').fill('Created by live frontend SQL write check');
  await pauseForVisualCheck(page, 'Filled description');

  await page.getByRole('button', { name: 'Create' }).click();
  await pauseForVisualCheck(page, 'Submitted create promotion form');

  await expect(page.getByText('Promotion created successfully')).toBeVisible();
  await expect(page.getByText(promoName)).toBeVisible();
  await pauseForVisualCheck(page, 'Promotion created and visible in UI');

  expect(consoleErrors, `Browser console/page errors:\n${consoleErrors.join('\n')}`).toEqual([]);
});
