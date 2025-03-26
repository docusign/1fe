import { test, expect } from '@playwright/test';

test('should redirect to correct url', async ({ page }) => {
    await page.goto('http://localhost:3001/app1/utils');

    await page.click('button[data-qa="utils.navigation.externalRedirect.btn"]');

    await expect(page).toHaveURL("https://www.google.com/");
});