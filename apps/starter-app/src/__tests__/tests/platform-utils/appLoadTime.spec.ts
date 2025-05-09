import { test, expect } from '@playwright/test';

test('Should get all entries', async ({ page }) => {
  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('bundle.js')) {
      console.log('🔍 Bundle URL:', url);
    }
  });

  await page.goto('http://localhost:3001/app1/utils');

  await page.click('button[data-qa="utils.appLoadTime.getEntries.btn"]');

  const resultElement = page.locator(
    'div[data-qa="utils.appLoadTime.getEntries.result"]',
  );

  await expect(resultElement).toContainText('Entry Type: mark');
});

test('Should mark and measure custom events', async ({ page }) => {
  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('bundle.js')) {
      console.log('🔍 Bundle URL:', url);
    }
  });

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
  // await context.route('**/bundle.js', async (route, request) => {
  //   const response = await route.fetch(); // continue and get real response
  //   const body = await response.text();
  //   const firstLines = body.split('\n').slice(0, 5).join('\n');

  //   console.log('📦 First 5 lines of bundle.js:\n' + firstLines);

  //   // Continue with the original response
  //   await route.fulfill({ response });
  // });

  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('bundle.js')) {
      console.log('🔍 Bundle URL:', url);
    }
  });

  await page.goto('http://localhost:3001/app1/utils');

  // const content = await page.content();
  // console.log('Page HTML:', content);

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
