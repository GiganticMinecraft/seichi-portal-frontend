import { expect, test } from '@playwright/test';

// Issue 817: システム設定がダークモードのユーザーが初回アクセスしたとき、
// ライトの一瞬表示なく初回ペイントからダークで表示されることを保証する。
// InitColorSchemeScript がペイント前に data-mui-color-scheme を確定させ、
// CSS 変数テーマがその属性で配色を切り替えることを、解決後の最終状態で検証する。

const darkSurface = 'rgb(8, 21, 34)'; // #081522
const lightSurface = 'rgb(244, 247, 251)'; // #F4F7FB

test('システム設定がダークのとき、ランディングページが初回からダーク配色になる', async ({
  browser,
}) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute(
    'data-mui-color-scheme',
    'dark'
  );
  const backgroundColor = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor
  );
  expect(backgroundColor).toBe(darkSurface);

  await context.close();
});

test('システム設定がライトのとき、ランディングページがライト配色になる', async ({
  browser,
}) => {
  const context = await browser.newContext({ colorScheme: 'light' });
  const page = await context.newPage();
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute(
    'data-mui-color-scheme',
    'light'
  );
  const backgroundColor = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor
  );
  expect(backgroundColor).toBe(lightSurface);

  await context.close();
});
