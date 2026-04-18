import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get emailInput() {
    return this.page.locator('[data-test="login-email"]');
  }

  get passwordInput() {
    return this.page.locator('[data-test="login-password"]');
  }

  get submitButton() {
    return this.page.locator('[data-test="login-submit"]');
  }

  get errorMessages() {
    return this.page.locator('[data-test="login-error"] li');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
