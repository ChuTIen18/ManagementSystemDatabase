import { test, expect, Page } from '@playwright/test';

const creds = {
  manager: { email: 'manager@coffee.local', password: '123456', roleLabel: 'Quản lý', fullName: 'Demo Manager' },
  pos: { email: 'pos@coffee.local', password: '123456', roleLabel: 'Máy POS', fullName: 'Demo POS' },
  staff: { email: 'staff@coffee.local', password: '123456', roleLabel: 'Nhân viên', fullName: 'Demo Staff' },
};

async function mockAuth(page: Page, role: 'manager' | 'pos' | 'staff') {
  const userPayload = {
    id: role === 'manager' ? 1 : role === 'pos' ? 2 : 3,
    email: creds[role].email,
    full_name: creds[role].fullName,
    role,
    position: role === 'manager' ? 'Manager' : role === 'pos' ? 'POS Operator' : 'Staff',
  };

  await page.route('**/api/v1/auth/refresh', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          accessToken: `mock-${role}-token`,
        },
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

    if (body.email !== creds[role].email || body.password !== creds[role].password) {
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
          accessToken: `mock-${role}-token`,
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
}

async function login(page: Page, role: 'manager' | 'pos' | 'staff') {
  await mockAuth(page, role);
  await page.goto('/login');
  await expect(page.getByText('☕ Coffee House')).toBeVisible();

  await page.getByRole('button', { name: new RegExp(creds[role].roleLabel) }).click();
  await page.getByPlaceholder(role === 'manager' ? 'manager@coffee.local' : 'Nhập tên đăng nhập').fill(creds[role].email);
  await page.getByPlaceholder('Nhập mật khẩu').fill(creds[role].password);
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
}

test.describe('Login and role flows', () => {
  test('manager login redirects and sees manager menu items', async ({ page }) => {
    await login(page, 'manager');
    await expect(page).toHaveURL(/\/manager$/);
    await expect(page.getByRole('link', { name: 'Staff Management', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Inventory', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });

  test('pos login redirects and does not see manager-only menu', async ({ page }) => {
    await login(page, 'pos');
    await expect(page).toHaveURL(/\/pos$/);
    await expect(page.getByRole('link', { name: 'Orders', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Menu', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Staff Management', exact: true })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Inventory', exact: true })).toHaveCount(0);
  });

  test('staff login redirects and cannot open manager route', async ({ page }) => {
    await login(page, 'staff');
    await expect(page).toHaveURL(/\/staff$/);
    await page.goto('/inventory-management');
    await expect(page).toHaveURL(/\/unauthorized$/);
    await expect(page.getByText('Unauthorized')).toBeVisible();
  });

  test('invalid credentials show login error', async ({ page }) => {
    await mockAuth(page, 'manager');
    await page.goto('/login');
    await page.getByRole('button', { name: /Quản lý/ }).click();
    await page.getByPlaceholder('manager@coffee.local').fill('manager@coffee.local');
    await page.getByPlaceholder('Nhập mật khẩu').fill('wrong-password');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await expect(page.getByText(/Invalid email or password|Đăng nhập thất bại/)).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });
});