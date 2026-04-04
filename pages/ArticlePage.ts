import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticlePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(slug: string) {
    const url = this.page.url();
    if (url.startsWith('http://localhost')) {
      // Already on the app — use client-side navigation to preserve the Redux store
      await this.navHome.click();
      await this.page.locator(`a[href^="/article/${slug}"]`).first().click();
    } else {
      // Blank page — no session to preserve, full navigation is fine
      await this.page.goto(`/article/${slug}`);
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
    return this.page.locator('[data-test="article-edit-button"]');
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

  get commentInput() {
    return this.page.locator('[data-test="comment-input"]');
  }

  get commentSubmit() {
    return this.page.locator('[data-test="comment-submit"]');
  }

  get comments() {
    return this.page.locator('[data-test="comment-item"]');
  }

  async postComment(text: string) {
    await this.commentInput.fill(text);
    await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/comments') && r.request().method() === 'POST'),
      this.commentSubmit.click(),
    ]);
  }
}
