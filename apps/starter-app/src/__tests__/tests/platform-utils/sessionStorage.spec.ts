import { test, expect } from '@playwright/test';

test('Displays a string value that is set in sessionStorage', async ({ page }) => {
  await page.goto('http://localhost:3001/app1/utils');

  await page.click('button[data-qa="utils.localAndSessionStorage1FE.sessionStorage.getSessionString.btn"]');

  const resultElement = page.locator(
    'pre[data-qa="utils.sessionStorage.getSession.result"]',
  );

  await expect(resultElement).toHaveText('sessionStringValue');
});

test('Displays a boolean value that is set in sessionStorage', async ({ page }) => {
  await page.goto('http://localhost:3001/app1/utils');
  await page.click('button[data-qa="utils.localAndSessionStorage1FE.sessionStorage.getSessionBoolean.btn"]');

  const resultElement = page.locator(
    'pre[data-qa="utils.sessionStorage.getSession.result"]',
  );

  await expect(resultElement).toHaveText('true');
});
