import { test, expect, Page } from '@playwright/test';

const manager = {
  email: 'manager@coffee.local',
  password: '123456',
  fullName: 'Demo Manager',
};

const routes = [
  '/manager',
  '/orders',
  '/menu',
  '/staff-management',
  '/schedule-management',
  '/attendance-management',
  '/leave-management',
  '/inventory-management',
  '/equipment-management',
  '/promotions-management',
  '/table-management',
  '/customer-feedback',
  '/reports-analytics',
];

async function mockManagerAuth(page: Page) {
  const userPayload = {
    id: 1,
    email: manager.email,
    full_name: manager.fullName,
    role: 'manager',
    position: 'Manager',
  };

  await page.route('**/api/v1/auth/refresh', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: { accessToken: 'mock-manager-token' },
      }),
    });
  });

  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: userPayload,
      }),
    });
  });

  await page.route('**/api/v1/auth/login', async (route) => {
    const body = route.request().postDataJSON() as { email: string; password: string };
    if (body.email !== manager.email || body.password !== manager.password) {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: { message: 'Invalid email or password' } }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          accessToken: 'mock-manager-token',
          user: userPayload,
        },
      }),
    });
  });

  await page.route('**/api/v1/auth/logout', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });

  await page.route('**/api/v1/**', async (route) => {
    const method = route.request().method();
    const url = route.request().url();

    if (url.includes('/auth/')) {
      await route.fallback();
      return;
    }

    if (method === 'GET') {
      if (url.includes('/reports/summary')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              todayRevenue: 0,
              monthRevenue: 0,
              totalOrders: 0,
              totalCustomers: 0,
            },
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [],
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {},
      }),
    });
  });
}

async function loginAsManager(page: Page) {
  await mockManagerAuth(page);
  await page.goto('/login');
  await page.getByRole('button', { name: /Quản lý|Quan ly/i }).click();
  await page.getByPlaceholder('manager@coffee.local').fill(manager.email);
  await page.getByPlaceholder('Nhập mật khẩu').fill(manager.password);
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await expect(page).toHaveURL(/\/manager$/);
}

test.describe('Full application smoke and integration', () => {
  test('manager can navigate all major pages without UI crash, console error, or failed API', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    await loginAsManager(page);

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');
      const html = await page.locator('body').innerHTML({ timeout: 15000 });
      expect(html.trim().length, `Expected ${route} to render non-empty body`).toBeGreaterThan(0);
      await expect(page.locator('text=/Loading\\.\\.\\./i')).toHaveCount(0, { timeout: 15000 });
      await expect(page.locator('body')).not.toContainText(/Cannot read|undefined is not|is not a function|Something went wrong/i);
      expect(await page.locator('body').locator('*').count()).toBeGreaterThan(0);
    }

    expect(consoleErrors, `Browser console/page errors:\n${consoleErrors.join('\n')}`).toEqual([]);
  });

  test('logout clears session and returns to login', async ({ page }) => {
    await loginAsManager(page);
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText('☕ Coffee House')).toBeVisible();
    await expect(page.getByRole('button', { name: /Quản lý|Quan ly/i })).toBeVisible();
  });
});