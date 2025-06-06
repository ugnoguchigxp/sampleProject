import { test, expect } from '@playwright/test';
import { setAuthToken } from './util/auth';

const baseUrl = 'http://localhost:3002';

BBS_E2E();

function BBS_E2E() {
  test('BBS一覧画面が表示され、投稿詳細に遷移できる', async ({ page }) => {
    await setAuthToken(page);
    await page.goto(baseUrl + '/bbs/list');
    await expect(page.locator('#bbs-list-page')).toBeVisible();
    await expect(page.locator('[data-testid="post-title"]').first()).toBeVisible();
    const firstTitle = await page.locator('[data-testid="post-title"]').first();
    await firstTitle.click();
    await expect(page.locator('#bbs-post-detail-page')).toBeVisible();
  });

  test('BBS新規投稿ができる', async ({ page }) => {
    await setAuthToken(page);
    await page.goto(baseUrl + '/bbs/list');
    // 新規投稿ボタンをクリック
    //await page.getByRole('button', { name: /新規投稿|create post/i }).click();
    await page.locator('#create-post-button').click();
    await expect(page.locator('#bbs-create-post-page')).toBeVisible();
    // 入力
    await page.getByLabel('Title').fill('E2Eテスト投稿');
    await page.getByLabel('Content').fill('E2Eテスト本文');
    // カテゴリ選択（3番目のカテゴリを選択）
    const select = await page.locator('select#categoryId');
    const options = await select.locator('option').all();
    if (options.length > 2) {
      const value = (await options[2]?.getAttribute('value')) ?? '';
      if (value) {
        await select.selectOption(value);
      }
    }
    // 投稿ボタンをクリック（idで指定）
    await page.locator('#submit-post').click();
    // 投稿一覧に戻り、投稿タイトルが表示されること
    await expect(page.locator('#bbs-list-page')).toBeVisible();
    // 投稿タイトルが一意に特定できるよう修正
    const postTitles = page.locator('[data-testid="post-title"]');
    await expect(postTitles.filter({ hasText: 'E2Eテスト投稿' }).first()).toBeVisible();
  });

  test('BBS投稿詳細でコメント投稿できる', async ({ page }) => {
    await setAuthToken(page);
    await page.goto(baseUrl + '/bbs/list');
  });
}
