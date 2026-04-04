import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly url = '/register';

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto(this.url);
    await expect(this.page).toHaveURL(/\/register/);
  }

  get usernameInput() {
    return this.page.locator('[data-test="register-username"]');
  }

  get emailInput() {
    return this.page.locator('[data-test="register-email"]');
  }

  get passwordInput() {
    return this.page.locator('[data-test="register-password"]');
  }

  get submitButton() {
    return this.page.locator('[data-test="register-submit"]');
  }

  get errorMessages() {
    return this.page.locator('[data-test="register-error"] li');
  }

  async register(username: string, email: string, password: string) {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
