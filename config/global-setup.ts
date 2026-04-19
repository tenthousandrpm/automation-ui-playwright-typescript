import * as dotenv from 'dotenv';
dotenv.config();

import { execSync } from 'child_process';
import { createCsrfAwareApiContext } from './csrf';

async function seedUser(username: string, email: string, password: string): Promise<string> {
  const { context, csrfToken } = await createCsrfAwareApiContext();

  const response = await context.post('users', {
    headers: { 'X-CSRFToken': csrfToken },
    data: { user: { username, email, password } },
  });

  if (response.status() !== 200 && response.status() !== 201) {
    throw new Error(
      `Failed to seed user "${username}": ${response.status()} ${await response.text()}`
    );
  }

  console.log(`User "${username}" created`);
  const { user } = await response.json();
  await context.dispose();
  return user.token;
}

async function setAvatar(token: string, seed: string): Promise<void> {
  const { context, csrfToken } = await createCsrfAwareApiContext();
  await context.put('user', {
    headers: { Authorization: `Token ${token}`, 'X-CSRFToken': csrfToken },
    data: { user: { image: `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}` } },
  });
  await context.dispose();
}

async function globalSetup() {
  const project = process.env.COMPOSE_PROJECT_NAME ?? 'automation-ui-playwright-typescript';
  const container = `${project}-api-1`;

  console.log('Flushing database...');
  execSync(`docker exec ${container} python manage.py flush --no-input`, { stdio: 'inherit' });

  const testUserToken = await seedUser(
    process.env.TEST_USER_USERNAME || 'testuser',
    process.env.TEST_USER_EMAIL!,
    process.env.TEST_USER_PASSWORD!
  );
  await setAvatar(testUserToken, 'testuser');

  const authorToken = await seedUser(
    process.env.ARTICLE_AUTHOR_USERNAME || 'articleauthor',
    process.env.ARTICLE_AUTHOR_EMAIL || 'author@example.com',
    process.env.ARTICLE_AUTHOR_PASSWORD || 'password123'
  );
  await setAvatar(authorToken, 'articleauthor');
}

export default globalSetup;
