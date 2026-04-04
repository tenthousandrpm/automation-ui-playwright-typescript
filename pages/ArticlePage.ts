import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticlePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(slug: string) {
    await this.page.goto(`/article/${slug}`);
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
    return this.page.locator('[data-test="favorite-extended-button"]');
  }

  get followButton() {
    return this.page.locator('[data-test="follow-button"]');
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
    await this.commentSubmit.click();
  }
}
