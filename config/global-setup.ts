import { execSync } from 'child_process';
import { createCsrfAwareApiContext } from './csrf';
import { config } from './env';

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
  const response = await context.put('user', {
    headers: { Authorization: `Token ${token}`, 'X-CSRFToken': csrfToken },
    data: { user: { image: `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}` } },
  });
  await context.dispose();
  if (!response.ok()) {
    throw new Error(
      `Failed to set avatar (seed="${seed}"): ${response.status()} ${await response.text()}`
    );
  }
}

async function globalSetup() {
  if (!process.env.CI) {
    const project = process.env.COMPOSE_PROJECT_NAME ?? 'automation-ui-playwright-typescript';
    const container = `${project}-api-1`;
    console.log('Flushing database...');
    execSync(`docker exec ${container} python manage.py flush --no-input`, { stdio: 'inherit' });
  }

  const testUserToken = await seedUser(
    config.credentials.testUser.username,
    config.credentials.testUser.email,
    config.credentials.testUser.password
  );
  await setAvatar(testUserToken, config.credentials.testUser.username);

  const authorToken = await seedUser(
    config.credentials.articleAuthor.username,
    config.credentials.articleAuthor.email,
    config.credentials.articleAuthor.password
  );
  await setAvatar(authorToken, config.credentials.articleAuthor.username);
}

export default globalSetup;
