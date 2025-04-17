import { test, expect } from '@playwright/test';

test('Circular spinner should be displayed while widget is loading @e2e @visual', async ({
  page,
}) => {
  const loader = page.locator('p[data-qa="app.custom.loader"]');
  await page.route(/.*\/starter-kit\/[0-9.]+\/js\/1fe-bundle\.js/, (route) => {
    setTimeout(() => {
      route.continue();
    }, 10000);
  });
  await page.goto('http://localhost:3001/app1/utils', {
    waitUntil: 'domcontentloaded',
  });

  await expect(loader).toBeAttached();
});
