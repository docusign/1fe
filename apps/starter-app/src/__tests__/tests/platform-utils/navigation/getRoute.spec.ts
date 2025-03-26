import { test, expect } from '@playwright/test';

test('return correct route with query param', async ({ page }) => {
    await page.goto('http://localhost:3001/app1/utils?test=test');

    page.on('dialog', async (dialog) => {
        expect(
            dialog
            .message()
            .startsWith('/utils?test=test'),
        ).toBeTruthy();

        await dialog.dismiss();
    });

    await page.click('button[data-qa="utils.navigation.getRoute.btn"]');
});

test('return correct route without query param', async ({ page }) => {
    await page.goto('http://localhost:3001/app1/utils?test=test');

    page.on('dialog', async (dialog) => {
        expect(
            dialog
            .message()
            .startsWith('/utils'),
        ).toBeTruthy();

        await dialog.dismiss();
    });

    await page.click('button[data-qa="utils.navigation.getRoute.excludeParams.btn"]');
});