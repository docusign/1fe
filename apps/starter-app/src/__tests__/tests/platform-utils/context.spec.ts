import { test, expect } from '@playwright/test';

test('Context functions in @internal/generic-child-widget', async ({
  page,
}) => {
  // Navigate to the app
  await page.goto('http://localhost:3001/app1/utils');

  await page.click('button[data-qa="utils.context.get.btn"]');

  const resultElement = page.locator(
    'div[data-qa="wsk.context.result.container"]',
  );

  await expect(await resultElement).toHaveText('');

  await page.click('button[data-qa="utils.context.self.btn"]');
  await page.waitForTimeout(100);

  const selfContent = JSON.parse((await resultElement.textContent()) || '{}');
  expect(selfContent.widgetId).toContain('@1fe/starter-kit');
});
