import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticlePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(slug: string) {
    const url = this.page.url();
    if (url.startsWith('http://localhost')) {
      // Already on the app — navigate by clicking a link to preserve the Redux store.
      // page.goto() causes a full page reload which loses the in-memory auth state.
      // Check the current page first (after login the user lands on their profile page
      // which already lists their articles), then fall back to the home feed for articles
      // created by a different user.
      const articleLink = () => this.page.locator(`a[href="/article/${slug}/"]`).first();
      const foundOnCurrentPage = await articleLink().isVisible({ timeout: 3000 }).catch(() => false);
      if (!foundOnCurrentPage) {
        await this.navHome.click();
      }
      await articleLink().click();
    } else {
      // Blank page — no session to preserve, full navigation is fine
      await this.page.goto(`/article/${slug}/`);
    }
    await expect(this.page).toHaveURL(/\/article\//);
  }

  get title() {
    return this.page.locator('[data-test="article-title"]');
  }

  get author() {
    return this.page.locator('[data-test="article-author"]');
  }

  get body() {
    return this.page.locator('[data-test="article-body"]');
  }

  get editButton() {
    return this.page.locator('.banner [data-test="article-edit-button"]');
  }

  get deleteButton() {
    return this.page.locator('.banner [data-test="article-delete-button"]');
  }

  get tagList() {
    return this.page.locator('[data-test="article-body"] .tag-list');
  }

  get favoriteButton() {
    return this.page.locator('.banner [data-test="favorite-extended-button"]');
  }

  get unfavoriteButton() {
    return this.page.locator('.banner [data-test="unfavorite-extended-button"]');
  }

  async clickFavorite() {
    await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/favorite') && r.status() === 200),
      this.favoriteButton.click(),
    ]);
  }

  async clickUnfavorite() {
    await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/favorite') && r.status() === 200),
      this.unfavoriteButton.click(),
    ]);
  }

  async clickDelete() {
    await Promise.all([
      this.page.waitForURL(/\//),
      this.deleteButton.click(),
    ]);
  }

  get commentInput() {
    return this.page.locator('[data-test="comment-input"]');
  }

  get commentSubmit() {
    return this.page.locator('[data-test="comment-submit"]');
  }

  get comments() {
    return this.page.locator('[data-test="comment-item"]');
  }

  async deleteComment(text: string) {
    const commentItem = this.comments.filter({ hasText: text });
    await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/comments/') && r.request().method() === 'DELETE'),
      commentItem.locator('[data-test="comment-delete-button"]').click(),
    ]);
  }

  async postComment(text: string) {
    await this.commentInput.fill(text);
    await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/comments') && r.request().method() === 'POST'),
      this.commentSubmit.click(),
    ]);
  }
}
