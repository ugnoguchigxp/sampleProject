import { test, expect } from '@playwright/test';
import { setAuthToken } from './util/auth';

const baseUrl = 'http://localhost:3002';

i18n_E2E();

function i18n_E2E() {
  test('言語切替でUIが英語/日本語に変化する', async ({ page }) => {
    await setAuthToken(page);
    await page.goto(baseUrl + '/bbs/list');
    // 言語セレクターのselect要素を取得
    const select = await page.locator('#language-selector');
    const options = await select.locator('option').all();
    // 2番目（index=1）がEnglish, 1番目（index=0）が日本語想定
    if (options.length > 1) {
      // 英語に切り替え
      const enValue = (await options[1]?.getAttribute('value')) ?? '';
      if (enValue) {
        await select.selectOption(enValue);
        await expect(page.locator('h1')).toContainText(/Sample/);
      }
      // 日本語に戻す
      const jaValue = (await options[0]?.getAttribute('value')) ?? '';
      if (jaValue) {
        await select.selectOption(jaValue);
        await expect(page.locator('h1')).toContainText(/サンプル/);
      }
    }
  });
}
