import { test, expect } from '@playwright/test';

test('Make sure you can navigate via button click ', async ({ page }) => {
  await page.goto('http://localhost:3001/app1/utils');

  const homeButton = page.locator('span.ant-menu-title-content', {
    hasText: 'Home',
  });
  await homeButton.click();

  const wskHome = page.locator('p[data-qa="wsk.page.welcome"]');
  await expect(wskHome).toBeVisible();
});

test('Make sure you can change page (via click) and then go back', async ({
  page,
}) => {
  await page.goto('http://localhost:3001/app1/utils');

  const homeButton = page.locator('span.ant-menu-title-content', {
    hasText: 'Home',
  });
  await homeButton.click();

  const wskHome = page.locator('p[data-qa="wsk.page.welcome"]');
  await expect(wskHome).toBeVisible();

  await page.goBack();

  await expect(page).toHaveURL('http://localhost:3001/app1/utils');
});

test('Make sure you can change page (via click) and then go back and then forward', async ({
  page,
}) => {
  await page.goto('http://localhost:3001/app1/utils');

  const homeButton = page.locator('span.ant-menu-title-content', {
    hasText: 'Home',
  });
  await homeButton.click();

  const wskHome = page.locator('p[data-qa="wsk.page.welcome"]');
  await expect(wskHome).toBeVisible();

  await page.goBack();

  await expect(page).toHaveURL('http://localhost:3001/app1/utils');

  await page.goForward();

  await expect(wskHome).toBeVisible();
});

test('Make sure we can deep link into a widget-starter-kit page', async ({
  page,
}) => {
  await page.goto('http://localhost:3001/app1/utils');

  await expect(page).toHaveURL('http://localhost:3001/app1/utils');
});

test('Make sure we can deep link into a widget-starter-kit page with trailing slash and url', async ({
  page,
}) => {
  await page.goto('http://localhost:3001/app1/utils/?test=test');

  await expect(page).toHaveURL('http://localhost:3001/app1/utils/?test=test');
});

test('Make sure we can deep link into a widget-starter-kit page with query params', async ({
  page,
}) => {
  await page.goto('http://localhost:3001/app1/utils?test=test&test2=test2');

  await expect(page).toHaveURL(
    'http://localhost:3001/app1/utils?test=test&test2=test2',
  );
});
