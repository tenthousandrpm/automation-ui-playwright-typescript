import { test as base, expect, APIRequestContext } from '@playwright/test';
import { createCsrfAwareApiContext } from '../config/csrf';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ArticlePage } from '../pages/ArticlePage';
import { EditorPage } from '../pages/EditorPage';

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  articlePage: ArticlePage;
  editorPage: EditorPage;
};

type AuthFixtures = {
  authenticatedPage: { token: string; username: string; email: string };
  apiRequest: APIRequestContext;
};

export const test = base.extend<Pages & AuthFixtures>({
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

  apiRequest: async ({}, use) => {
    const { context } = await createCsrfAwareApiContext();
    await use(context);
    await context.dispose();
  },

  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/users/login') && r.status() === 200),
      (async () => {
        await page.locator('[data-test="login-email"]').fill(process.env.TEST_USER_EMAIL!);
        await page.locator('[data-test="login-password"]').fill(process.env.TEST_USER_PASSWORD!);
        await page.locator('[data-test="login-submit"]').waitFor({ state: 'attached' });
        await expect(page.locator('[data-test="login-submit"]')).toBeEnabled();
        await page.locator('[data-test="login-submit"]').click();
      })(),
    ]);

    const { user } = await response.json();
    await page.waitForURL((url) => !url.pathname.startsWith('/login'));

    await use({ token: user.token, username: user.username, email: user.email });
  },
});

export { expect } from '@playwright/test';
