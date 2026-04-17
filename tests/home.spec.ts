import { test, expect } from '../fixtures';
import { getAuthToken, createArticle, followUser } from '../fixtures/api-helpers';

test.describe('Home Page', () => {
  let uniqueTag: string;

  test.beforeAll(async ({ apiRequest }) => {
    const token = await getAuthToken(apiRequest, process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);
    uniqueTag = `testtag${Date.now()}`;
    await Promise.all([
      createArticle(apiRequest, token, {
        title: `Home Feed Article ${Date.now()}`,
        description: 'Seeded for home feed test',
        body: 'Article body content',
      }),
      createArticle(apiRequest, token, {
        title: `Tagged Article ${Date.now()}`,
        description: 'Tagged article',
        body: 'Body',
        tags: [uniqueTag],
      }),
    ]);
  });

  test('global feed loads articles without error @smoke', async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.articlePreviews.first()).toBeVisible();
  });

  test('tag list is visible on home page @regression', async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.tagList).toBeVisible();
  });

  test('clicking a tag filters the feed @regression', async ({ homePage }) => {
    await homePage.goto();
    await homePage.clickTag(uniqueTag);
    await expect(homePage.articlePreviews.first()).toBeVisible();
  });
});

test.describe('Your Feed', () => {
  test.beforeAll(async ({ apiRequest }) => {
    // Test user follows the article author, who has an article
    const testUserToken = await getAuthToken(
      apiRequest,
      process.env.TEST_USER_EMAIL!,
      process.env.TEST_USER_PASSWORD!,
    );
    const authorUsername = process.env.ARTICLE_AUTHOR_USERNAME || 'articleauthor';
    await followUser(apiRequest, testUserToken, authorUsername);

    const authorToken = await getAuthToken(
      apiRequest,
      process.env.ARTICLE_AUTHOR_EMAIL || 'author@example.com',
      process.env.ARTICLE_AUTHOR_PASSWORD || 'password123',
    );
    await createArticle(apiRequest, authorToken, {
      title: `Your Feed Article ${Date.now()}`,
      description: 'For your feed test',
      body: 'Article body content',
    });
  });

  test('authenticated user sees Your Feed tab @smoke', async ({ authenticatedPage, homePage }) => {
    await homePage.goto();
    await expect(homePage.yourFeedTab).toBeVisible();
  });

  test('Your Feed shows articles from followed users @regression', async ({ authenticatedPage, homePage }) => {
    await homePage.goto();
    await homePage.clickYourFeed();
    await expect(homePage.articlePreviews.first()).toBeVisible();
  });
});
