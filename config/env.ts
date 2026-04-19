import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:4100',
  apiUrl: (process.env.API_URL || 'http://localhost:8000/api').replace(/\/?$/, '/'),
  serverUrl: new URL(process.env.API_URL || 'http://localhost:8000/api').origin,
  headless: process.env.HEADLESS !== 'false',
  credentials: {
    testUser: {
      username: process.env.TEST_USER_USERNAME || 'testuser',
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_USER_PASSWORD!,
    },
    articleAuthor: {
      username: process.env.ARTICLE_AUTHOR_USERNAME || 'articleauthor',
      email: process.env.ARTICLE_AUTHOR_EMAIL || 'author@example.com',
      password: process.env.ARTICLE_AUTHOR_PASSWORD || 'password123',
    },
  },
} as const;
