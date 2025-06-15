import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// test-resultsディレクトリの絶対パスを取得
const TOKEN_PATH = path.join(process.cwd(), 'frontend', 'test-results', 'auth-token.json');

// Mock API レスポンスを使ったログイン画面のE2Eテスト

test.describe('ログイン画面（Mock API）', () => {
  test('E2E固定ユーザーでログインできる', async ({ page }) => {
    await page.route('**/auth/login', async (route, request) => {
      const postData = request.postDataJSON();
      if (postData.email === 'e2e-test@example.com' && postData.password === 'Password@123') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            token: 'mock-token',
            user: { id: 'e2e-test-user-id', email: 'e2e-test@example.com', username: 'test_e2e' }
          })
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'メールアドレスまたはパスワードが間違っています' })
        });
      }
    });
    await page.goto('/login');
    await page.fill('input[name="email"]', 'e2e-test@example.com');
    await page.fill('input[name="password"]', 'Password@123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\//); // ログイン後の遷移先に合わせて調整
  });

  test('Test-1ユーザーでログインできる', async ({ page }) => {
    await page.route('**/auth/login', async (route, request) => {
      const postData = request.postDataJSON();
      if (postData.email === 'test-1@example.com' && postData.password === 'password') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            token: 'mock-token',
            user: { id: 'test-1-id', email: 'test-1@example.com', username: 'test_1' }
          })
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'メールアドレスまたはパスワードが間違っています' })
        });
      }
    });
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test-1@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\//); // ログイン後の遷移先に合わせて調整
  });

  test('不正な認証情報でエラーが表示される', async ({ page }) => {
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'メールアドレスまたはパスワードが間違っています' })
      });
    });
    await page.goto('/login');
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=メールアドレスまたはパスワードが間違っています')).toBeVisible();
  });
});

// 実際のバックエンドAPIを使ったログインシナリオ

test.describe('ログイン画面（実API）', () => {
  test('E2E固定ユーザーで実際にログインできる', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'e2e-test@example.com');
    await page.fill('input[name="password"]', 'Password@123');
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/auth/login') && resp.status() === 200),
      page.click('button[type="submit"]'),
    ]);
    const data = await response.json();
    fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
    fs.writeFileSync(TOKEN_PATH, JSON.stringify({ token: data.token }), 'utf-8');
    await expect(page).toHaveURL(/\//);
  });

  test('Test-1ユーザーで実際にログインできる', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test-1@example.com');
    await page.fill('input[name="password"]', 'password');
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/auth/login') && resp.status() === 200),
      page.click('button[type="submit"]'),
    ]);
    const data = await response.json();
    fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
    fs.writeFileSync(TOKEN_PATH, JSON.stringify({ token: data.token }), 'utf-8');
    await expect(page).toHaveURL(/\//);
  });
});

// 認証トークンを使ったテスト例

test.describe('認証トークンを利用したテスト', () => {
  test('ログイン済み状態でマイページにアクセスできる', async ({ page }) => {
    const { token } = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    await page.addInitScript(token => {
      window.localStorage.setItem('token', token);
    }, token);
    await page.goto('/mypage');
    await expect(page.locator('text=マイページ')).toBeVisible();
  });
});
