import * as fs from 'fs';
import * as path from 'path';
import { Page } from '@playwright/test';

const TOKEN_PATH = path.join(process.cwd(), 'temp', 'auth-token.json');

/**
 * テスト用: ローカルストレージに認証トークンをセットする
 * @param page PlaywrightのPageインスタンス
 */
export async function setAuthToken(page: Page) {
  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error(
      `auth-token.json が見つかりません。先に frontend/e2e/02login.spec.ts の「実API」テストを実行してください。`
    );
  }
  const { token } = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  if (token) {
    await page.addInitScript((token: string) => {
      localStorage.setItem('token', token);
    }, token);
  }
}
