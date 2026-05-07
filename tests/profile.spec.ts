import { randomUUID } from 'crypto';
import { test, expect } from '../fixtures';
import { getAuthToken, createArticle } from '../fixtures/api-helpers';

test.describe('Profile Page', () => {
  const authorUsername = process.env.ARTICLE_AUTHOR_USERNAME || 'articleauthor';

  test.beforeAll(async ({ apiRequest }) => {
    const token = await getAuthToken(
      apiRequest,
      process.env.ARTICLE_AUTHOR_EMAIL || 'author@example.com',
      process.env.ARTICLE_AUTHOR_PASSWORD || 'password123'
    );
    await createArticle(apiRequest, token, {
      title: `Profile Page Setup Article ${randomUUID().split('-')[0]}`,
      description: 'For profile page test setup',
      body: 'Article body content',
    });
  });

  test('profile page shows username', { tag: '@smoke' }, async ({ profilePage }) => {
    await profilePage.goto(authorUsername);
    await expect(profilePage.username).toHaveText(authorUsername);
  });

  test(
    'My Articles tab shows articles authored by the user',
    { tag: '@regression' },
    async ({ profilePage, apiRequest }) => {
      const token = await getAuthToken(
        apiRequest,
        process.env.ARTICLE_AUTHOR_EMAIL || 'author@example.com',
        process.env.ARTICLE_AUTHOR_PASSWORD || 'password123'
      );
      await createArticle(apiRequest, token, {
        title: `Profile Page Article ${randomUUID().split('-')[0]}`,
        description: 'For profile page test',
        body: 'Article body content',
      });
      await profilePage.goto(authorUsername);
      await profilePage.myArticlesTab.click();
      await expect(profilePage.articlePreviews.first()).toBeVisible();
    }
  );

  test('Favorited Articles tab is visible', { tag: '@regression' }, async ({ profilePage }) => {
    await profilePage.goto(authorUsername);
    await expect(profilePage.favoritedArticlesTab).toBeVisible();
  });

  test(
    'own profile shows Edit Profile Settings instead of follow button',
    { tag: '@regression' },
    async ({ authenticatedPage, profilePage }) => {
      await profilePage.goto(process.env.TEST_USER_USERNAME!);
      await expect(profilePage.followButton).not.toBeVisible();
      await expect(profilePage.unfollowButton).not.toBeVisible();
    }
  );
});

test.describe('Follow / Unfollow', () => {
  const authorUsername = process.env.ARTICLE_AUTHOR_USERNAME || 'articleauthor';

  test.beforeAll(async ({ apiRequest }) => {
    // Ensure the author has at least one article visible in the home feed so the
    // client-side navigation in profilePage.goto() can find their author link.
    const token = await getAuthToken(
      apiRequest,
      process.env.ARTICLE_AUTHOR_EMAIL || 'author@example.com',
      process.env.ARTICLE_AUTHOR_PASSWORD || 'password123'
    );
    await createArticle(apiRequest, token, {
      title: `Follow Test Article ${randomUUID().split('-')[0]}`,
      description: 'For follow test setup',
      body: 'Article body content',
    });
  });

  test(
    'authenticated user can follow and unfollow another user',
    { tag: '@regression' },
    async ({ authenticatedPage, profilePage }) => {
      await profilePage.goto(authorUsername);

      await profilePage.clickUnfollow();
      await expect(profilePage.followButton).toBeVisible();

      await profilePage.clickFollow();
      await expect(profilePage.unfollowButton).toBeVisible();
    }
  );
});
