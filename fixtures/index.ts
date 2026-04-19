import { test as base, expect, APIRequestContext } from '@playwright/test';
import { createCsrfAwareApiContext } from '../config/csrf';
import { config } from '../config/env';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ArticlePage } from '../pages/ArticlePage';
import { EditorPage } from '../pages/EditorPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';
import { ApiClient } from './api-client';

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  articlePage: ArticlePage;
  editorPage: EditorPage;
  profilePage: ProfilePage;
  settingsPage: SettingsPage;
};

type AuthFixtures = {
  authenticatedPage: void;
  apiRequest: APIRequestContext;
  authenticatedApiClient: ApiClient;
  authorApiClient: ApiClient;
};

type NavigationFixtures = {
  _navigate: void;
};

export const test = base.extend<Pages & AuthFixtures & NavigationFixtures>({
  _navigate: [
    async ({ page }, use) => {
      await page.goto('/');
      await use();
    },
    { auto: true },
  ],

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  },

  editorPage: async ({ page }, use) => {
    await use(new EditorPage(page));
  },

  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },

  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },

  apiRequest: async ({}, use) => {
    const { context } = await createCsrfAwareApiContext();
    await use(context);
    await context.dispose();
  },

  authenticatedApiClient: async ({ apiRequest }, use) => {
    const client = await ApiClient.create(
      apiRequest,
      config.credentials.testUser.email,
      config.credentials.testUser.password
    );
    await use(client);
  },

  authorApiClient: async ({ apiRequest }, use) => {
    const client = await ApiClient.create(
      apiRequest,
      config.credentials.articleAuthor.email,
      config.credentials.articleAuthor.password
    );
    await use(client);
  },

  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.navSignIn.click();

    await Promise.all([
      page.waitForResponse((r) => r.url().includes('/users/login') && r.status() === 200),
      (async () => {
        await page.locator('[data-test="login-email"]').fill(config.credentials.testUser.email);
        await page
          .locator('[data-test="login-password"]')
          .fill(config.credentials.testUser.password);
        await page.locator('[data-test="login-submit"]').waitFor({ state: 'attached' });
        await expect(page.locator('[data-test="login-submit"]')).toBeEnabled();
        await page.locator('[data-test="login-submit"]').click();
      })(),
    ]);

    await page.waitForURL((url) => !url.pathname.startsWith('/login'));

    await use();
  },
});

export { expect } from '@playwright/test';
