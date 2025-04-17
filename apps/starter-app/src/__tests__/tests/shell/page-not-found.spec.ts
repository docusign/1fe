import { test, expect } from '@playwright/test';

test('the app redirects to HTTP_404_NOT_FOUND_URL on unmatched route', async ({
  page,
}) => {
  await page.goto('http://localhost:3001/not-valid');

  const notFoundHeader = page.locator(
    'h1[data-qa="shell.notFound.page.header"]',
  );
  await expect(notFoundHeader).toBeVisible();

  expect(page.url()).toBe('http://localhost:3001/not-valid');
});

test('the app redirects to HTTP_404_NOT_FOUND_URL on unmatched route with valid query params', async ({
  page,
}) => {
  await page.goto('http://localhost:3001/not-valid?test=test');

  const notFoundHeader = page.locator(
    'h1[data-qa="shell.notFound.page.header"]',
  );
  await expect(notFoundHeader).toBeVisible();

  expect(page.url()).toBe('http://localhost:3001/not-valid?test=test');
});

test('If HTTP_404_NOT_FOUND_URL is not send, can use the go back button to go back a page', async ({
  page,
}) => {
  await page.goto('http://localhost:3001/app1');
  await page.goto('http://localhost:3001/not-valid');

  const notFoundHeader = page.locator(
    'h1[data-qa="shell.notFound.page.header"]',
  );
  await expect(notFoundHeader).toBeVisible();

  await page.goBack();

  await expect(page.url()).toBe('http://localhost:3001/app1');
});
