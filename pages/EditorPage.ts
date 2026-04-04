import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class EditorPage extends BasePage {
  readonly url = '/editor';

  constructor(page: Page) {
    super(page);
  }

  async goto(slug?: string) {
    await this.page.goto(slug ? `/editor/${slug}` : this.url);
  }

  get titleInput() {
    return this.page.locator('[data-test="article-title-input"]');
  }

  get descriptionInput() {
    return this.page.locator('[data-test="article-description-input"]');
  }

  get bodyInput() {
    return this.page.locator('[data-test="article-body-input"]');
  }

  get tagsInput() {
    return this.page.locator('[data-test="article-tags-input"]');
  }

  get submitButton() {
    return this.page.locator('[data-test="article-submit"]');
  }

  get errorMessages() {
    return this.page.locator('[data-test="article-error"] li');
  }

  async publish(article: { title: string; description: string; body: string; tags?: string }) {
    await this.titleInput.fill(article.title);
    await this.descriptionInput.fill(article.description);
    await this.bodyInput.fill(article.body);
    if (article.tags) await this.tagsInput.fill(article.tags);
    await this.submitButton.click();
  }
}
