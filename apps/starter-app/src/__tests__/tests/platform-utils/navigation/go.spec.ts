import { test, expect } from '@playwright/test';

// TODO[1fe]: Test again
test('Should navigate forwards, backwards, and reload', async ({ page }) => {
    await page.goto('http://localhost:3001/app1/utils');
    await page.goto('http://localhost:3001/app1');
    await page.goto('http://localhost:3001/app1/utils');

    await page.click('button[data-qa="utils.navigation.go.btn"]');

    expect(page.url()).toBe('http://localhost:3001/app1');
    await page.evaluate(() => window.history.go(-1));

    const goTextBox = await page.locator('input[placeholder="-1"]');

    await goTextBox.fill('0');
    await page.click('button[data-qa="utils.navigation.go.btn"]');
    expect(page.url()).toBe('http://localhost:3001/app1/utils');

    await goTextBox.fill('1');
    await page.click('button[data-qa="utils.navigation.go.btn"]');
    expect(page.url()).toBe('http://localhost:3001/app1');
});