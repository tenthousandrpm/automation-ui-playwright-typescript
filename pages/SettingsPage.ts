import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SettingsPage extends BasePage {
  readonly url = '/settings';

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navSettings.click();
    await expect(this.page).toHaveURL(/\/settings/);
  }

  get imageInput() {
    return this.page.locator('[data-test="settings-image"]');
  }

  get usernameInput() {
    return this.page.locator('[data-test="settings-username"]');
  }

  get bioInput() {
    return this.page.locator('[data-test="settings-bio"]');
  }

  get emailInput() {
    return this.page.locator('[data-test="settings-email"]');
  }

  get passwordInput() {
    return this.page.locator('[data-test="settings-password"]');
  }

  get submitButton() {
    return this.page.locator('[data-test="settings-submit"]');
  }

  get logoutButton() {
    return this.page.locator('[data-test="logout-button"]');
  }
}
