import { Page } from '@playwright/test';


export const selectImportMapOverrideButton = (page: Page) =>
  page.locator('button.imo-trigger');

export const selectDevtoolImportMapOverrideButton = (page: Page) =>
  page.getByTestId('1ds-devtool-import-map-ui-button');

export const overrideWidgetUrlWithUi = async ({
  page,
  widgetId,
  widgetBundleUrl,
}: {
  page: Page;
  widgetId: string;
  widgetBundleUrl: string;
}) => {
  // if (FEATURE_FLAGS.enable1dsDevtool && isIntegrationEnvironment(ENVIRONMENT)) {
  //   await selectDevtoolImportMapOverrideButton(page).click();
  // } else {
    await selectImportMapOverrideButton(page).click();
  // }

  await page.getByPlaceholder('Search modules').fill('generic-child-widget');
  await page.getByRole('button', { name: `Default ${widgetId}` }).click();
  await page.getByLabel('Override URL:').click();
  await page.getByLabel('Override URL:').fill(widgetBundleUrl);
  await page.getByRole('button', { name: 'Apply override' }).click();

  await page.waitForTimeout(1000);
};

export const resetAllOverrides = async (page: Page) => {
  const resetButton = page.getByRole('button', { name: 'Reset all overrides' });

  if (await resetButton.isVisible()) {
    await resetButton.click();
  } else {
    await selectImportMapOverrideButton(page).dispatchEvent('click');
    const resetButton = page.getByRole('button', {
      name: 'Reset all overrides',
    });
    await resetButton.click();
  }
};
