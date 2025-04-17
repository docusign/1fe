import { test, expect } from '@playwright/test';

test('preload url in iframe in browser env', async ({ page }) => {
  await page.goto('http://localhost:3001/app1/utils');

  const existingIframe = await page.$('iframe');
  expect(existingIframe).not.toBeTruthy();

  await page.click('button[data-qa="utils.navigation.preloadUrl.btn"]');

  const iframe = await page.$('iframe');
  expect(iframe).toBeTruthy();

  const srcAttribute = await iframe?.getAttribute('src');
  expect(srcAttribute).toBe(
    'https://cdn.jsdelivr.net/gh/docusign/mock-cdn-assets/libs/lodash/4.17.21/lodash.js',
  );
});
