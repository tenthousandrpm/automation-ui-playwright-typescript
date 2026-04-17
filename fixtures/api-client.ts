import { APIRequestContext } from '@playwright/test';
import { TestArticle, getAuthToken, createArticle, deleteArticle, followUser, createComment } from './api-helpers';

export class ApiClient {
  private constructor(
    private readonly request: APIRequestContext,
    readonly token: string,
  ) {}

  static async create(request: APIRequestContext, email: string, password: string): Promise<ApiClient> {
    const token = await getAuthToken(request, email, password);
    return new ApiClient(request, token);
  }

  createArticle(article: { title: string; description: string; body: string; tags?: string[] }): Promise<TestArticle> {
    return createArticle(this.request, this.token, article);
  }

  deleteArticle(slug: string): Promise<void> {
    return deleteArticle(this.request, this.token, slug);
  }

  followUser(username: string): Promise<void> {
    return followUser(this.request, this.token, username);
  }

  createComment(slug: string, body: string): Promise<number> {
    return createComment(this.request, this.token, slug, body);
  }
}
