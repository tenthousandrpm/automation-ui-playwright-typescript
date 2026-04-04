function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:4100',
  apiUrl: (process.env.API_URL || 'http://localhost:8000/api').replace(/\/?$/, '/'),
  serverUrl: `http://localhost:${process.env.API_PORT || '8000'}`,
  headless: process.env.HEADLESS !== 'false',
} as const;
