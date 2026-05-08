import { Page, expect } from '@playwright/test';
import { config } from '../config/env';
import { BasePage } from './BasePage';

export class ArticlePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(slug: string, author?: string) {
    const articleLink = () => this.page.locator(`a[href="/article/${slug}/"]`).first();
    if (author) {
      await this.page.locator(`nav a[href="/profile/${author}/"]`).click();
    } else {
      const foundOnCurrentPage = await articleLink()
        .isVisible({ timeout: 500 })
        .catch(() => false);
      if (!foundOnCurrentPage) {
        if (this.page.url().startsWith(config.baseUrl)) {
          await this.navHome.click();
        } else {
          await this.page.goto('/');
        }
      }
    }
    await articleLink().click();
    await expect(this.page).toHaveURL(/\/article\//);
  }

  currentSlug() {
    return this.page.url().split('/article/')[1]?.replace(/\/$/, '');
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
    await this.favoriteButton.click();
  }

  async clickUnfavorite() {
    await this.unfavoriteButton.click();
  }

  async clickDelete() {
    await Promise.all([this.page.waitForURL(/\//), this.deleteButton.click()]);
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
    await this.comments
      .filter({ hasText: text })
      .locator('[data-test="comment-delete-button"]')
      .click();
  }

  async postComment(text: string) {
    await this.commentInput.fill(text);
    await this.commentSubmit.click();
  }
}
