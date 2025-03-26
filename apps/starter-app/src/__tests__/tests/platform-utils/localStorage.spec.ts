import { test, expect } from '@playwright/test';

test('Displays a string value that is set in localStorage', async ({ page }) => {
  await page.goto('http://localhost:3001/app1/utils');

  await page.click('button[data-qa="utils.localAndSessionStorage1FE.localStorage.get.btn"]');

  const resultElement = page.locator(
    'pre[data-qa="utils.localStorage.get.result"]',
  );

  await expect(resultElement).toHaveText('value1');
});

test('Displays a boolean value that is set in localStorage', async ({ page }) => {
  await page.goto('http://localhost:3001/app1/utils');
  await page.click('button[data-qa="utils.localAndSessionStorage1FE.localStorage.getBoolean.btn"]');

  const resultElement = page.locator(
    'pre[data-qa="utils.localStorage.get.result"]',
  );

  await expect(resultElement).toHaveText('true');
});
