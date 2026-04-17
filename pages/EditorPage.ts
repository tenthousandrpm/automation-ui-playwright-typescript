import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class EditorPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(slug?: string) {
    if (slug) {
      await this.page.goto(`/editor/${slug}`);
    } else {
      await this.navNewArticle.click();
    }
    await expect(this.page).toHaveURL(/\/editor/);
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

  async publish(article: { title: string; description: string; body: string; tags?: string | string[] }) {
    await this.titleInput.fill(article.title);
    await this.descriptionInput.fill(article.description);
    await this.bodyInput.fill(article.body);
    if (article.tags) {
      const tags = Array.isArray(article.tags) ? article.tags : [article.tags];
      for (const tag of tags) {
        await this.tagsInput.pressSequentially(tag);
        await this.tagsInput.press(',');
      }
    }
    await this.submitButton.click();
  }
}
