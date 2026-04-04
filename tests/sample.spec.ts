import { test, expect } from '../fixtures';

test('home page loads and shows global feed', async ({ homePage }) => {
  await homePage.goto();
  await expect(homePage.globalFeedTab).toBeVisible();
});
