import { test, expect } from '@playwright/test';

const mockedTimestamp = 1609477200000; // Jan 1, 2021
const expectedEventData = {
  eventInfo: {
    sender: { id: '@1fe/starter-kit' },
    timestamp: mockedTimestamp,
  },
  data: { param1: 'Listener is working!' },
};


test('subscribe + publish + unsubscribe', async ({ page }) => {
    await page.goto('http://localhost:3001/app1/utils');

    await page.click('button[data-qa="utils.eventBus.get.btn"]');

    const resultElement = page.locator(
        'div[data-qa="utils.widgets.eventBus.result.container"]',
      );

    await expect(resultElement).toContainText('unchanged');

    // find publish1 button and click it, should remain unchanged
    await page.click('button[data-qa="utils.eventBus.publish1.btn"]');
    await expect(resultElement).toContainText('unchanged');

    // find subscribe button and click it, result should now say subscribed
    await page.click('button[data-qa="eventBus.subscribe.btn"]');
    await expect(resultElement).toContainText('subscribed');

    page.evaluate((mockedTimestamp) => {
        Date.now = () => {
        return mockedTimestamp;
        };
    }, mockedTimestamp);

    // click publish1 button again, result should be the event data
    await page.click('button[data-qa="utils.eventBus.publish1.btn"]');
    await expect(resultElement).toContainText(JSON.stringify(expectedEventData));

    // find publish2 button and click it, nothing should change
    await page.click('button[data-qa="utils.eventBus.publish2.btn"]');
    await expect(resultElement).toContainText(JSON.stringify(expectedEventData));

    // find unsubscribe button and click it, should read unsubscirbed
    await page.click('button[data-qa="eventBus.unsubscribe.btn"]');
    await expect(resultElement).toContainText('unsubscribed');

    // clicking publish1 button again should not change the result
    await page.click('button[data-qa="utils.eventBus.publish1.btn"]');
    await expect(resultElement).toContainText('unsubscribed');

    // clicking publish2 button again should not change the result
    await page.click('button[data-qa="utils.eventBus.publish2.btn"]');
    await expect(resultElement).toContainText('unsubscribed');
});
  
