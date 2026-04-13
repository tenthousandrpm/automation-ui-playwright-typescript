import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly url = '/';

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    const url = this.page.url();
    if (url.startsWith('http://localhost')) {
      // Already on the app — use client-side navigation to preserve the Redux store.
      // page.goto('/') would reload the page and may race with redux-persist's
      // localStorage flush, causing the session to appear missing on initial render.
      await this.navHome.click();
    } else {
      await this.page.goto(this.url);
    }
    await expect(this.page).toHaveURL(/\/((\?.*)?$)/);
  }

  get globalFeedTab() {
    return this.page.locator('[data-test="global-feed-tab"]');
  }

  get yourFeedTab() {
    return this.page.locator('[data-test="your-feed-tab"]');
  }

  get tagList() {
    return this.page.locator('[data-test="tag-list"]');
  }

  get articlePreviews() {
    return this.page.locator('[data-test="article-preview"]');
  }

  get pagination() {
    return this.page.locator('[data-test="pagination"]');
  }

  tag(name: string) {
    return this.page.locator(`[data-test="tag-${name}"]`);
  }

  async clickGlobalFeed() {
    await this.globalFeedTab.click();
  }

  async clickYourFeed() {
    await this.yourFeedTab.click();
  }

  async clickTag(name: string) {
    await this.tag(name).click();
  }
}
