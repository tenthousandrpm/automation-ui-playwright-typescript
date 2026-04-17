import { test, expect } from '../fixtures';

test.describe('Settings', () => {
  test('settings page pre-fills current user data @smoke', async ({ authenticatedPage, settingsPage, page }) => {
    await settingsPage.goto();
    await expect(settingsPage.usernameInput).toHaveValue(process.env.TEST_USER_USERNAME!);
    await expect(settingsPage.emailInput).toHaveValue(process.env.TEST_USER_EMAIL!);
  });

  test('user can update their bio @regression', async ({ authenticatedPage, settingsPage, page }) => {
    await settingsPage.goto();
    // Wait for the form to be populated with the user's data from the API, not just rendered
    await expect(settingsPage.emailInput).toHaveValue(process.env.TEST_USER_EMAIL!);
    const newBio = `Bio updated at ${Date.now()}`;
    await settingsPage.bioInput.fill(newBio);
    await settingsPage.passwordInput.fill(process.env.TEST_USER_PASSWORD!);
    // Wait for React Hook Form to register the form as dirty before clicking
    await expect(settingsPage.submitButton).toBeEnabled();
    await settingsPage.submitButton.click();
    await expect(page).toHaveURL(new RegExp(`/profile/${process.env.TEST_USER_USERNAME}`));
  });

  test('submit is disabled when password is too short @regression', async ({ authenticatedPage, settingsPage }) => {
    await settingsPage.goto();
    await settingsPage.usernameInput.waitFor({ state: 'visible' });
    // A non-empty password shorter than 8 chars fails the schema (min(8))
    await settingsPage.passwordInput.fill('short');
    await settingsPage.passwordInput.blur();
    await expect(settingsPage.submitButton).toBeDisabled();
  });

  test('unauthenticated user is redirected away from settings @regression', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).not.toHaveURL(/\/settings/);
  });
});
