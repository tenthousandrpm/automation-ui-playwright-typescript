import { test, expect } from '../fixtures';
import { getAuthToken, createArticle, createComment } from '../fixtures/api-helpers';

test.describe.configure({ mode: 'serial' });

test.describe('Comments', () => {
  let slug: string;

  test.beforeAll(async ({ apiRequest }) => {
    const token = await getAuthToken(apiRequest, process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);
    const article = await createArticle(apiRequest, token, {
      title: `Comment Test Article ${Date.now()}`,
      description: 'For commenting',
      body: 'Article body content',
    });
    slug = article.slug;
  });

  test('authenticated user can post a comment', { tag: '@smoke' }, async ({ authenticatedPage, articlePage }) => {
    const comment = `Test comment ${Date.now()}`;
    await articlePage.goto(slug);
    await articlePage.postComment(comment);
    await expect(articlePage.comments.first()).toContainText(comment);
  });

  test('unauthenticated user sees sign in prompt instead of comment form', { tag: '@regression' }, async ({
    page,
    articlePage,
  }) => {
    await articlePage.goto(slug);
    await expect(page.getByText('Sign in or sign up to add comments')).toBeVisible();
    await expect(articlePage.commentInput).not.toBeVisible();
  });

  test('authenticated user can delete their comment', { tag: '@regression' }, async ({
    authenticatedPage,
    articlePage,
    apiRequest,
  }) => {
    const token = await getAuthToken(apiRequest, process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);
    const commentText = `Deletable comment ${Date.now()}`;
    await createComment(apiRequest, token, slug, commentText);
    await articlePage.goto(slug);
    // Wait for the specific comment to appear before interacting
    await expect(articlePage.comments.filter({ hasText: commentText })).toBeVisible();
    await articlePage.deleteComment(commentText);
    await expect(articlePage.comments.filter({ hasText: commentText })).not.toBeVisible();
  });
});
