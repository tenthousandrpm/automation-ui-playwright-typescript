import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(username: string) {
    const url = this.page.url();
    if (url.startsWith('http://localhost')) {
      // Already on the app — use client-side navigation to preserve the Redux store.
      // The nav contains a link to the current user's own profile; for other users
      // navigate home first and click the author link in the feed.
      const navLink = this.page.locator(`nav a[href="/profile/${username}/"]`);
      if (await navLink.isVisible({ timeout: 500 }).catch(() => false)) {
        await navLink.click();
      } else {
        await this.navHome.click();
        await this.page.locator(`a[href="/profile/${username}/"]`).first().click();
      }
    } else {
      // Blank page — no session to preserve, full navigation is fine
      await this.page.goto(`/profile/${username}/`);
    }
    await expect(this.page).toHaveURL(new RegExp(`/profile/${username}`));
  }

  get username() {
    return this.page.locator('[data-test="app-header-username"]');
  }

  get bio() {
    return this.page.locator('[data-test="app-header-bio"]');
  }

  get followButton() {
    return this.page.locator('[data-test="follow-button"]');
  }

  get unfollowButton() {
    return this.page.locator('[data-test="unfollow-button"]');
  }

  get myArticlesTab() {
    return this.page.locator('[data-test="profile-tab-my-articles"]');
  }

  get favoritedArticlesTab() {
    return this.page.locator('[data-test="profile-tab-favorited-articles"]');
  }

  get articlePreviews() {
    return this.page.locator('[data-test="article-preview"]');
  }

  async clickFollow() {
    await expect(this.followButton).toBeVisible();
    await this.followButton.click();
  }

  async clickUnfollow() {
    await expect(this.unfollowButton).toBeVisible();
    await this.unfollowButton.click();
  }
}
