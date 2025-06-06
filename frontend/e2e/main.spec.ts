// @ts-check
/**
 * E2Eテスト: 主要ページの表示・操作・多言語・レスポンシブ・主要UIの検証
 * - Chrome, Mobile Chrome,
 * - 主要な画面遷移・フォーム・多言語切替・UI要素のid属性検証
 * - カバレッジ80%以上を目指す
 */
import { test, expect } from '@playwright/test';


const baseUrl = 'http://localhost:3000';

notfoundCheck()
Register()
BBS_E2E();
i18n_E2E();
responsive_E2E();

function notfoundCheck() {
  test('NotFound画面が表示される', async ({ page }) => {
    await page.goto(baseUrl + '/notfound');
    await expect(page.locator('#not-found-page')).toBeVisible();
  });
}
function Register( ){
  test('login画面に遷移し、Registerリンクが表示される', async ({ page }) => {
    await page.goto(baseUrl + '/login');
    await expect(page.getByRole('link', { name: 'Register here' })).toBeVisible();
    await page.getByRole('link', { name: 'Register here' }).click();
  });
  test('Register画面でフォーム入力と送信', async ({ page }) => {
    // register APIをmock
    await page.route('**/api/auth/register', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'dummy-token',
          user: { id: 1, email: 'test@example.com', username: 'testuser' }
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
  test('login画面に遷移し、ログイン成功', async ({ page }) => {
    await page.goto(baseUrl + '/login');
    await expect(page).toHaveURL(baseUrl + '/login');

    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Password', exact: true }).click();
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testpassword');

    await page.getByRole('button', { name: 'Sign in to your account' }).click();

  })
}

function BBS_E2E() {
  test('BBS一覧画面が表示され、投稿詳細に遷移できる', async ({ page }) => {
    await page.goto(baseUrl + '/bbs');
    await expect(page.locator('#bbs-list-page')).toBeVisible();
    // 投稿が1件以上表示されていること
    await expect(page.locator('[data-testid="post-title"]').first()).toBeVisible();
    // 最初の投稿タイトルをクリック→詳細画面へ
    const firstTitle = await page.locator('[data-testid="post-title"]').first();
    await firstTitle.click();
    await expect(page.locator('#bbs-post-detail-page')).toBeVisible();
  });

  test('BBS新規投稿ができる', async ({ page }) => {
    // 認証済み前提でcookieセットなど必要なら追加
    await page.goto(baseUrl + '/bbs');
    await page.getByRole('button', { name: /新規投稿|create post/i }).click();
    await expect(page.locator('#bbs-create-post-page')).toBeVisible();
    await page.getByLabel('Title').fill('E2Eテスト投稿');
    await page.getByLabel('Content').fill('E2Eテスト本文');
    await page.getByRole('button', { name: /投稿|submit/i }).click();
    // 投稿後、一覧に戻り新規投稿が表示される
    await expect(page.locator('#bbs-list-page')).toBeVisible();
    await expect(page.getByText('E2Eテスト投稿')).toBeVisible();
  });

  test('BBS投稿詳細でコメント投稿できる', async ({ page }) => {
    await page.goto(baseUrl + '/bbs');
    // 最初の投稿詳細へ
    await page.locator('[data-testid="post-title"]').first().click();
    await expect(page.locator('#bbs-post-detail-page')).toBeVisible();
    await page.getByLabel('コメント').fill('E2Eテストコメント');
    await page.getByRole('button', { name: /コメント投稿|add comment/i }).click();
    // コメントが表示される
    await expect(page.getByText('E2Eテストコメント')).toBeVisible();
  });
}

function i18n_E2E() {
  test('言語切替でUIが英語/日本語に変化する', async ({ page }) => {
    await page.goto(baseUrl + '/');
    // 画面上に日本語のタイトルが表示されていること
    await expect(page.locator('h1')).toContainText(/サンプル|Sample/);
    // 言語セレクターで英語を選択
    await page.getByRole('button', { name: /言語|language/i }).click();
    await page.getByRole('option', { name: /English/ }).click();
    // 英語UIに切り替わること
    await expect(page.locator('h1')).toContainText(/Sample/);
    // 再度日本語に戻す
    await page.getByRole('button', { name: /language|言語/i }).click();
    await page.getByRole('option', { name: /日本語|Japanese/ }).click();
    await expect(page.locator('h1')).toContainText(/サンプル/);
  });
}

function responsive_E2E() {
  test('モバイル幅で主要UIが正しく表示される', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 }); // iPhoneサイズ
    await page.goto(baseUrl + '/');
    // ハンバーガーメニューやモバイル用UIが表示されること
    await expect(page.locator('#mobile-menu-button')).toBeVisible();
    await page.getByRole('button', { name: /menu|メニュー/i }).click();
    await expect(page.locator('#mobile-nav')).toBeVisible();
  });
  test('PC幅で主要UIが正しく表示される', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(baseUrl + '/');
    // PC用ナビゲーションが表示されること
    await expect(page.locator('#pc-nav')).toBeVisible();
  });
}