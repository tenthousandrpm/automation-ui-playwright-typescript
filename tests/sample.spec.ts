import { test, expect } from '@playwright/test';

test('page title should not be empty', async ({ page }) => {
  await page.goto('/');
  await expect(page).not.toHaveTitle('');
});