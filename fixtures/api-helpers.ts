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

export async function getAuthToken(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<string> {
  const response = await request.post('users/login', {
    data: { user: { email, password } },
  });
  if (!response.ok()) {
    throw new Error(`Login failed for "${email}": ${response.status()} ${await response.text()}`);
  }
  const { user } = await response.json();
  return user.token;
}

export async function createArticle(
  request: APIRequestContext,
  token: string,
  article: { title: string; description: string; body: string; tags?: string[] }
): Promise<TestArticle> {
  const { tags, ...rest } = article;
  const response = await request.post('articles', {
    headers: { Authorization: `Token ${token}` },
    data: { article: { ...rest, ...(tags ? { tagList: tags } : {}) } },
  });
  if (!response.ok()) {
    throw new Error(
      `Failed to create article "${article.title}": ${response.status()} ${await response.text()}`
    );
  }
  const { article: created } = await response.json();
  return { slug: created.slug, title: created.title };
}

export async function deleteArticle(
  request: APIRequestContext,
  token: string,
  slug: string
): Promise<void> {
  await request.delete(`articles/${slug}`, {
    headers: { Authorization: `Token ${token}` },
  });
}

export async function followUser(
  request: APIRequestContext,
  token: string,
  username: string
): Promise<void> {
  await request.post(`profiles/${username}/follow`, {
    headers: { Authorization: `Token ${token}` },
  });
}

export async function createComment(
  request: APIRequestContext,
  token: string,
  slug: string,
  body: string
): Promise<number> {
  const response = await request.post(`articles/${slug}/comments`, {
    headers: { Authorization: `Token ${token}` },
    data: { comment: { body } },
  });
  if (!response.ok()) {
    throw new Error(
      `Failed to create comment on "${slug}": ${response.status()} ${await response.text()}`
    );
  }
  const { comment } = await response.json();
  return comment.id;
}
