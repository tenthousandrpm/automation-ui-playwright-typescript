import { request } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

async function globalSetup() {
  const apiContext = await request.newContext({
    baseURL: `http://localhost:${process.env.API_PORT || 8000}`,
  });

  // Django's CsrfViewMiddleware requires a CSRF token even for API endpoints.
  // Fetch the admin login page to obtain the csrftoken cookie, then mirror it
  // in the X-CSRFToken header for all subsequent unsafe requests.
  await apiContext.get('/admin/login/');
  const state = await apiContext.storageState();
  const csrfToken = state.cookies.find((c) => c.name === 'csrftoken')?.value ?? '';

  const response = await apiContext.post('/api/users', {
    headers: { 'X-CSRFToken': csrfToken },
    data: {
      user: {
        username: process.env.TEST_USER_USERNAME || 'testuser',
        email: process.env.TEST_USER_EMAIL!,
        password: process.env.TEST_USER_PASSWORD!,
      },
    },
  });

  if (response.status() === 201) {
    console.log('Test user created successfully');
  } else if (response.status() === 409) {
    console.log('Test user already exists, continuing');
  } else {
    throw new Error(`Failed to create test user: ${response.status()} ${await response.text()}`);
  }

  await apiContext.dispose();
}

export default globalSetup;
