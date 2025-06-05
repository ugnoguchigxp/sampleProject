import { test, expect } from '@playwright/test';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwidXNlcklkIjoiMSIsImV4cCI6NDEwMjQ0NDgwMH0.signature';
const user = { id: '1', email: 'test@example.com', username: 'testuser' };

test('login redirects to list', async ({ page }) => {
  await page.route('**/api/auth/login', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token, user }),
    });
  });

  await page.goto('/login');
  await page.fill('#email', user.email);
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('/bbs/list');
  await expect(page).toHaveURL(/\/bbs\/list/);
});

test('step input wizard flow', async ({ page }) => {
  await page.addInitScript(token => {
    localStorage.setItem('token', token);
  }, token);

  await page.goto('/step-input');
  await expect(page.getByText('Welcome to Our App')).toBeVisible();

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Full Name')).toBeVisible();

  await page.fill('#name', 'John Doe');
  await page.fill('#email', 'john@example.com');
  await page.fill('#phone', '1234567890');
  await page.click('form button[type="submit"]');
  await page.getByRole('button', { name: 'Next' }).click();

  await page.check('#notifications');
  await page.check('#dark');
  await page.click('form button[type="submit"]');
  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page.getByText('Review Your Information')).toBeVisible();
  await expect(page.getByText('John Doe')).toBeVisible();
  await expect(page.getByText('john@example.com')).toBeVisible();

  await page.getByRole('button', { name: 'Complete' }).click();
  await page.waitForURL('/');
  await expect(page).toHaveURL('/');
});
