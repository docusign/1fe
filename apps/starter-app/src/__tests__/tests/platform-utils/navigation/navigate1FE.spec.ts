import { test, expect } from '@playwright/test';

// TODO[1fe]: Remove skip and Test again
test.skip('navigate within widget with URL updates', async ({ page }) => {
    await page.goto('http://localhost:3001/app1/utils');

    await page.click('button[data-qa="utils.navigation.useNavigate.normal.btn"]');

    await expect(page.url()).toContain('http://localhost:3001/app1');
});

test('navigate within widget without URL updates', async ({ page }) => {
    await page.goto('http://localhost:3001/app1/utils');

    await page.click('button[data-qa="utils.navigation.useNavigate.noURL.btn"]');

    await expect(page.url()).toContain('http://localhost:3001/app1/utils');

    const wskHome = page.locator('p[data-qa="wsk.page.welcome"]');
    await expect(wskHome).toBeVisible();
});

// TODO[1fe]: Remove skip and Test again
test.skip('navigate within widget with URL updates should only persist runtime config param', async ({ page }) => {
    await page.goto(`http://localhost:3001/app1/utils?runtime_config_overrides={}&test=test`);

    await page.click('button[data-qa="utils.navigation.useNavigate.normal.btn"]');

    await expect(page.url()).toContain('?runtime_config_overrides=');
    await expect(page.url()).not.toContain('&test=');

    await page.goBack();

    await expect(page.url()).toContain('?runtime_config_overrides=');
    await expect(page.url()).not.toContain('&test=');
});

test('navigate from plugin to plugin with URL updates should only persist runtime config param', async ({ page }) => {
    await page.goto(`http://localhost:3001/app1/utils?runtime_config_overrides={}&test=test`);

    await page.click('button[data-qa="utils.navigation.useNavigate.p2p.btn"]');

    await expect(page.url()).toContain('?runtime_config_overrides=');
    await expect(page.url()).not.toContain('&test=');
});

test('navigate from plugin to plugin', async ({ page }) => {
    await page.goto(`http://localhost:3001/app1/utils`);

    await page.click('button[data-qa="utils.navigation.useNavigate.p2p.btn"]');

    await expect(page.url()).toContain('http://localhost:3001/app2');
});

test('navigate from plugin to plugin then go back', async ({ page }) => {
    await page.goto(`http://localhost:3001/app1/utils`);

    await page.click('button[data-qa="utils.navigation.useNavigate.p2p.btn"]');

    await expect(page.url()).toContain('http://localhost:3001/app2');

    await page.goBack();

    await expect(page.url()).toContain('http://localhost:3001/app1/utils');
});

// TODO[1fe]: Add deeplinked test for starter kit
// TODO[1fe]: Add nested widget navigation tests for starter kit



