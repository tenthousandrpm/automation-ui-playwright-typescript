import { randomUUID } from 'crypto';
import { test, expect } from '../fixtures';
import { getAuthToken, createArticle, deleteArticle, createComment } from '../fixtures/api-helpers';

test.describe('Comments', () => {
  let slug: string;

  test.beforeEach(async ({ apiRequest }) => {
    const token = await getAuthToken(
      apiRequest,
      process.env.TEST_USER_EMAIL!,
      process.env.TEST_USER_PASSWORD!
    );
    const article = await createArticle(apiRequest, token, {
      title: `Comment Test Article ${randomUUID().split('-')[0]}`,
      description: 'For commenting',
      body: 'Article body content',
    });
    slug = article.slug;
  });

  test.afterEach(async ({ apiRequest }) => {
    const token = await getAuthToken(
      apiRequest,
      process.env.TEST_USER_EMAIL!,
      process.env.TEST_USER_PASSWORD!
    );
    await deleteArticle(apiRequest, token, slug);
  });

  test(
    'authenticated user can post a comment',
    { tag: '@smoke' },
    async ({ authenticatedPage: _authenticatedPage, articlePage }) => {
      const comment = `Test comment ${randomUUID().split('-')[0]}`;
      await articlePage.goto(slug, process.env.TEST_USER_USERNAME!);
      await articlePage.postComment(comment);
      await expect(articlePage.comments.first()).toContainText(comment);
    }
  );

  test(
    'unauthenticated user sees sign in prompt instead of comment form',
    { tag: '@regression' },
    async ({ page, articlePage }) => {
      await Promise.all([
        page.waitForResponse((r) => r.url().includes('/articles') && r.status() === 200),
        page.goto('/'),
      ]);
      await page.locator('a[href^="/article/"]').first().click();
      await expect(page).toHaveURL(/\/article\//);
      await expect(page.getByText('Sign in or sign up to add comments')).toBeVisible();
      await expect(articlePage.commentInput).not.toBeVisible();
    }
  );

  test(
    'authenticated user can delete their comment',
    { tag: '@regression' },
    async ({ authenticatedPage: _authenticatedPage, articlePage, apiRequest }) => {
      const token = await getAuthToken(
        apiRequest,
        process.env.TEST_USER_EMAIL!,
        process.env.TEST_USER_PASSWORD!
      );
      const commentText = `Deletable comment ${randomUUID().split('-')[0]}`;
      await createComment(apiRequest, token, slug, commentText);
      await articlePage.goto(slug, process.env.TEST_USER_USERNAME!);
      // Wait for the specific comment to appear before interacting
      await expect(articlePage.comments.filter({ hasText: commentText })).toBeVisible();
      await articlePage.deleteComment(commentText);
      await expect(articlePage.comments.filter({ hasText: commentText })).not.toBeVisible();
    }
  );
});
