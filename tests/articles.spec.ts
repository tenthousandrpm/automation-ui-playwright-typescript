import { randomUUID } from 'crypto';
import { test, expect } from '../fixtures';
import { config } from '../config/env';

test.describe('Create Article', () => {
  test(
    'authenticated user can publish an article',
    { tag: '@smoke' },
    async ({ authenticatedPage, editorPage, articlePage, page }) => {
      const title = `Test Article ${randomUUID().split('-')[0]}`;
      await editorPage.goto();
      await editorPage.publish({
        title,
        description: 'A test article description',
        body: 'This is the body of the test article.',
        tags: 'test',
      });
      await expect(page).toHaveURL(/\/article\//);
      await expect(articlePage.title).toHaveText(title);
    }
  );

  test(
    'unauthenticated user is redirected away from editor',
    { tag: '@regression' },
    async ({ page }) => {
      await page.goto('/editor');
      await expect(page).not.toHaveURL(/\/editor/);
    }
  );
});

test.describe('View Article', () => {
  test(
    'article page shows title and body',
    { tag: '@smoke' },
    async ({ authenticatedPage, editorPage, articlePage }) => {
      const title = `View Test Article ${randomUUID().split('-')[0]}`;
      const body = 'Article body content';
      await editorPage.goto();
      await editorPage.publish({ title, description: 'For viewing', body });
      await expect(articlePage.title).toHaveText(title);
      await expect(articlePage.body).toContainText(body);
    }
  );
});

test.describe('Edit Article', () => {
  test(
    'author can edit their article',
    { tag: '@regression' },
    async ({ authenticatedPage, editorPage, articlePage, page }) => {
      await editorPage.goto();
      await editorPage.publish({
        title: `Edit Test Article ${randomUUID().split('-')[0]}`,
        description: 'For editing',
        body: 'Original body content',
      });
      await articlePage.editButton.click();
      await expect(page).toHaveURL(/\/editor\//);
      const updatedTitle = `Updated Title ${randomUUID().split('-')[0]}`;
      await editorPage.titleInput.fill(updatedTitle);
      await editorPage.submitButton.click();
      await expect(page).toHaveURL(/\/article\//);
      await expect(articlePage.title).toHaveText(updatedTitle);
    }
  );
});

test.describe('Delete Article', () => {
  test(
    'author can delete their article',
    { tag: '@regression' },
    async ({ authenticatedPage, editorPage, articlePage, page }) => {
      await editorPage.goto();
      await editorPage.publish({
        title: `Delete Test Article ${randomUUID().split('-')[0]}`,
        description: 'For deleting',
        body: 'Article body content',
      });
      await articlePage.clickDelete();
      await expect(page).not.toHaveURL(/\/article\//);
    }
  );
});

test.describe('Favorite Article', () => {
  test(
    'authenticated user can favorite and unfavorite an article',
    { tag: '@regression' },
    async ({ loginPage, editorPage, settingsPage, articlePage, page }) => {
      await loginPage.navSignIn.click();
      await loginPage.login(
        config.credentials.articleAuthor.email,
        config.credentials.articleAuthor.password
      );
      await page.waitForURL((url) => !url.pathname.startsWith('/login'));
      await editorPage.goto();
      await editorPage.publish({
        title: `Favorite Test Article ${randomUUID().split('-')[0]}`,
        description: 'For favoriting',
        body: 'Article body content',
      });
      await page.waitForURL(/\/article\//);
      const slug = articlePage.currentSlug();

      await settingsPage.goto();
      await settingsPage.logoutButton.click();

      await loginPage.navSignIn.click();
      await loginPage.login(
        config.credentials.testUser.email,
        config.credentials.testUser.password
      );
      await page.waitForURL((url) => !url.pathname.startsWith('/login'));
      await articlePage.goto(slug);
      await expect(articlePage.favoriteButton).toContainText('(0)');
      await articlePage.clickFavorite();
      await expect(articlePage.unfavoriteButton).toContainText('(1)');
      await articlePage.clickUnfavorite();
      await expect(articlePage.favoriteButton).toContainText('(0)');
    }
  );
});

test.describe('Article Tags', () => {
  test(
    'article page displays tags',
    { tag: '@regression' },
    async ({ authenticatedPage, editorPage, articlePage }) => {
      await editorPage.goto();
      await editorPage.publish({
        title: `Tags Test Article ${randomUUID().split('-')[0]}`,
        description: 'For tag display',
        body: 'Article body content',
        tags: ['playwright', 'typescript'],
      });
      await expect(articlePage.tagList).toContainText('playwright');
      await expect(articlePage.tagList).toContainText('typescript');
    }
  );
});
