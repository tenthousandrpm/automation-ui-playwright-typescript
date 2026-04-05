import { test, expect } from '../fixtures';
import { getAuthToken, createArticle } from '../fixtures/api-helpers';

test.describe('Create Article', () => {
  test('authenticated user can publish an article @smoke', async ({ authenticatedPage, editorPage, page }) => {
    const title = `Test Article ${Date.now()}`;
    await editorPage.goto();
    await editorPage.publish({
      title,
      description: 'A test article description',
      body: 'This is the body of the test article.',
      tags: 'test',
    });
    await expect(page).toHaveURL(/\/article\//);
    await expect(page.locator('[data-test="article-title"]')).toHaveText(title);
  });

  test('unauthenticated user is redirected away from editor @regression', async ({ page }) => {
    await page.goto('/editor');
    await expect(page).not.toHaveURL(/\/editor/);
  });
});

test.describe('View Article', () => {
  let slug: string;

  test.beforeAll(async ({ apiRequest }) => {
    const token = await getAuthToken(apiRequest, process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);
    const article = await createArticle(apiRequest, token, {
      title: `View Test Article ${Date.now()}`,
      description: 'For viewing',
      body: 'Article body content',
      tags: ['playwright', 'test'],
    });
    slug = article.slug;
  });

  test('article page shows title and body @smoke', async ({ articlePage }) => {
    await articlePage.goto(slug);
    await expect(articlePage.title).toBeVisible();
    await expect(articlePage.body).toBeVisible();
  });
});

test.describe('Favorite Article', () => {
  let slug: string;

  test.beforeAll(async ({ apiRequest }) => {
    // Article must be created by a different user so the test user can favorite it
    const token = await getAuthToken(
      apiRequest,
      process.env.ARTICLE_AUTHOR_EMAIL || 'author@example.com',
      process.env.ARTICLE_AUTHOR_PASSWORD || 'password123',
    );
    const article = await createArticle(apiRequest, token, {
      title: `Favorite Test Article ${Date.now()}`,
      description: 'For favoriting',
      body: 'Article body content',
    });
    slug = article.slug;
  });

  test('authenticated user can favorite an article @regression', async ({ authenticatedPage, articlePage }) => {
    await articlePage.goto(slug);
    await expect(articlePage.favoriteButton).toContainText('(0)');
    await articlePage.clickFavorite();
    await expect(articlePage.unfavoriteButton).toContainText('(1)');
  });
});
