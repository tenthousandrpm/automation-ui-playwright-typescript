import { test as base, request as baseRequest } from '@playwright/test';
import { config } from '../config/env';
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

  authenticatedPage: async ({ page }, use) => {
    const apiContext = await baseRequest.newContext({ baseURL: config.apiUrl });

    const response = await apiContext.post('/users/login', {
      data: {
        user: {
          email: process.env.TEST_USER_EMAIL!,
          password: process.env.TEST_USER_PASSWORD!,
        },
      },
    });

    const { user } = await response.json();

    // redux-persist stores state in localStorage under 'persist:root'
    // each slice is a JSON-serialized string within that object
    await page.goto('/');
    await page.evaluate((sessionUser: typeof user) => {
      const persistRoot = {
        session: JSON.stringify({
          email: sessionUser.email,
          token: sessionUser.token,
          username: sessionUser.username,
          image: sessionUser.image || '',
          bio: sessionUser.bio || '',
        }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      };
      localStorage.setItem('persist:root', JSON.stringify(persistRoot));
    }, user);

    await page.reload();
    await use({ token: user.token, username: user.username, email: user.email });
    await apiContext.dispose();
  },
});

export { expect } from '@playwright/test';
