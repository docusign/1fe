import { test, expect } from '@playwright/test';

const wskBaseUrl = 'http://localhost:3001/app1';
test('return correct absolute widget path', async ({ page }) => {
    await page.goto('http://localhost:3001/app1/utils');

    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe(wskBaseUrl);
        await dialog.dismiss();
    });

    await page.click('button[data-qa="utils.navigation.getAbsoluteWidgetPath.btn"]');
});