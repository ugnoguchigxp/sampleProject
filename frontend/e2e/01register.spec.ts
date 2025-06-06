import { test, expect } from '@playwright/test';

Register();

const baseUrl = 'http://localhost:3002';

function Register() {
  test('login画面に遷移し、Registerリンクが表示される', async ({ page }) => {
    await page.goto(baseUrl + '/login');
    await expect(page.getByRole('link', { name: 'Register here' })).toBeVisible();
    await page.getByRole('link', { name: 'Register here' }).click();
  });
  test('Register画面でフォーム入力と送信', async ({ page }) => {
    // register APIをmock
    await page.route('**/api/auth/register', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'dummy-token',
          user: { id: 1, email: 'test@example.com', username: 'testuser' },
        }),
      });
    });

    await page.goto(baseUrl + '/register');
    await expect(page).toHaveURL(baseUrl + '/register');
    await expect(page.locator('#register-screen')).toBeVisible();

    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('testuser');
    await page.getByRole('textbox', { name: 'Password', exact: true }).click();
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testpassword');
    await page.getByRole('textbox', { name: 'Confirm Password' }).click();
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('testpassword');
    await page.getByRole('button', { name: 'Create your account' }).click();
  });
}
