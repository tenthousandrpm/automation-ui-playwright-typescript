import { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  get navHome() {
    return this.page.locator('nav').getByRole('link', { name: 'Home' });
  }

  get navSignIn() {
    return this.page.locator('nav').getByRole('link', { name: 'Sign in' });
  }

  get navSignUp() {
    return this.page.locator('nav').getByRole('link', { name: 'Sign up' });
  }

  get navNewArticle() {
    return this.page.locator('nav').getByRole('link', { name: 'New Article' });
  }

  get navSettings() {
    return this.page.locator('nav').getByRole('link', { name: 'Settings' });
  }
}
