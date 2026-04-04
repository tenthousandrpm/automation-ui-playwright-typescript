import { APIRequestContext } from '@playwright/test';

export interface TestArticle {
  slug: string;
  title: string;
}

export interface TestUser {
  username: string;
  email: string;
  token: string;
}

export async function getAuthToken(request: APIRequestContext, email: string, password: string): Promise<string> {
  const response = await request.post('users/login', {
    data: { user: { email, password } },
  });
  const { user } = await response.json();
  return user.token;
}

export async function createArticle(
  request: APIRequestContext,
  token: string,
  article: { title: string; description: string; body: string; tags?: string[] },
): Promise<TestArticle> {
  const response = await request.post('articles', {
    headers: { Authorization: `Token ${token}` },
    data: { article },
  });
  const { article: created } = await response.json();
  return { slug: created.slug, title: created.title };
}

export async function deleteArticle(request: APIRequestContext, token: string, slug: string): Promise<void> {
  await request.delete(`articles/${slug}`, {
    headers: { Authorization: `Token ${token}` },
  });
}
