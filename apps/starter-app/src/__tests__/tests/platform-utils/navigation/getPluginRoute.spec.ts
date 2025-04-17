import { test, expect } from '@playwright/test';

test('return correct plugin route', async ({ page }) => {
  await page.goto('http://localhost:3001/app1/utils');

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toBe('/app1');
    await dialog.dismiss();
  });

  await page.click('button[data-qa="utils.navigation.getPluginRoute.btn"]');
});
