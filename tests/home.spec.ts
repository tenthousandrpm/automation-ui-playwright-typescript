import { test, expect } from '../fixtures';
import { getAuthToken, createArticle } from '../fixtures/api-helpers';

test.describe('Home Page', () => {
  test.beforeAll(async ({ apiRequest }) => {
    const token = await getAuthToken(apiRequest, process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);
    await createArticle(apiRequest, token, {
      title: `Home Feed Article ${Date.now()}`,
      description: 'Seeded for home feed test',
      body: 'Article body content',
    });
  });

  test('global feed loads articles without error @smoke', async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.articlePreviews.first()).toBeVisible();
  });
});
