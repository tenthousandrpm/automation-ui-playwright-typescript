import { request as baseRequest, APIRequestContext } from '@playwright/test';
import { config } from './env';

/**
 * Creates an APIRequestContext pre-loaded with Django's CSRF cookie and
 * X-CSRFToken header, so all POST/PUT/DELETE requests work without manual
 * token handling in each test or helper.
 */
export async function createCsrfAwareApiContext(): Promise<{
  context: APIRequestContext;
  csrfToken: string;
}> {
  const tempCtx = await baseRequest.newContext({ baseURL: config.serverUrl });
  await tempCtx.get('/admin/login/');
  const state = await tempCtx.storageState();
  const csrfToken = state.cookies.find((c) => c.name === 'csrftoken')?.value ?? '';
  await tempCtx.dispose();

  const context = await baseRequest.newContext({
    baseURL: config.apiUrl,
    storageState: state,
    extraHTTPHeaders: { 'X-CSRFToken': csrfToken },
  });

  return { context, csrfToken };
}
