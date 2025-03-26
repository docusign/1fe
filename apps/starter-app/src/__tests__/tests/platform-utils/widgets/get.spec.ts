import { test, expect } from '@playwright/test';

// TODO[1fe][milestone-1]: Add pinned and variant tests
// TODO[1fe]: Add nested widget test
test('should load widget', async ({ page }) => {
    await page.goto('http://localhost:3001/app1/utils');

    await page.click('button[data-qa="utils.widgets.get.btn"]');

    const childContainer = await page.locator('div[data-qa="utils.widgets.get.result.container"]');

    await expect(childContainer).toContainText('My component from app2 is mounted');
});