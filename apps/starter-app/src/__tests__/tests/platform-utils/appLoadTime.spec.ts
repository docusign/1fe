import { test, expect } from '@playwright/test';

test('Should get all entries', async ({ page }) => {
  await page.goto('http://localhost:3001/app1/utils');

  await page.click('button[data-qa="utils.appLoadTime.getEntries.btn"]');

  const resultElement = page.locator(
    'div[data-qa="utils.appLoadTime.getEntries.result"]',
  );

  await expect(resultElement).toContainText('Entry Type: mark');
});

test('Should mark and measure custom events', async ({ page }) => {
  await page.goto('http://localhost:3001/app1/utils');

  const resultElement = page.locator(
    'div[data-qa="utils.appLoadTime.measure.result"]',
  );

  await page.click('button[data-qa="utils.appLoadTime.mark.btn"]');

  await expect(resultElement).toHaveText('Mark started');

  await page.click('button[data-qa="utils.appLoadTime.measure.btn"]');

  await expect(resultElement).toContainText(
    '@1fe/starter-kit-iLove1FESoMuchMarkTest',
  );

  expect(
    /\d+(\.\d+)?/.test((await resultElement.innerText()) || ''),
  ).toBeTruthy();
});

test('Should successfully Mark Start and Mark End for generic-child-widget', async ({
  page,
}) => {
  // test.setTimeout(60000); // Set timeout to 60 seconds for this test

  // await page.waitForTimeout(30000); // ???

  await page.goto('http://localhost:3001/app1/utils');

  await page.click('button[data-qa="utils.appLoadTime.getEntries.btn"]');

  const resultElement = page.locator(
    'div[data-qa="utils.appLoadTime.getEntries.result"]',
  );

  await expect(resultElement).not.toContainText('@1fe/starter-kit2-start');
  await expect(resultElement).not.toContainText('@1fe/starter-kit2-end');

  await page.click('button[data-qa="utils.appLoadTime.get.btn"]');

  await page.waitForTimeout(500);

  await page.click('button[data-qa="utils.appLoadTime.getEntries.btn"]');

  await expect(resultElement).toContainText('@1fe/starter-kit2-start');
  await expect(resultElement).toContainText('@1fe/starter-kit2-end');
});
