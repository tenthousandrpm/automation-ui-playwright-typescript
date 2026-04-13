import { test, expect } from '../fixtures';

test.describe('Login', () => {
  test('successful login shows authenticated nav links @smoke', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);
    await expect(page).not.toHaveURL('/login');
    await expect(loginPage.navNewArticle).toBeVisible();
    await expect(loginPage.navSettings).toBeVisible();
  });

  test('wrong password shows error message @regression', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(process.env.TEST_USER_EMAIL!, 'wrongpassword');
    await expect(loginPage.errorMessages).toContainText('invalid');
  });

  test('unknown email shows error message @regression', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('nobody@nowhere.com', 'password123');
    await expect(loginPage.errorMessages).toContainText('invalid');
  });
});

test.describe('Register', () => {
  test('new user can register successfully @smoke', async ({ registerPage, page }) => {
    const unique = Date.now();
    await registerPage.goto();
    await registerPage.register(`newuser${unique}`, `newuser${unique}@example.com`, 'password123');
    await expect(page).not.toHaveURL('/register');
    await expect(registerPage.navNewArticle).toBeVisible();
  });

  test('duplicate email shows error @regression', async ({ registerPage }) => {
    await registerPage.goto();
    await registerPage.register('anotheruser', process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);
    await expect(registerPage.errorMessages).toBeVisible();
  });

  test('duplicate username shows error @regression', async ({ registerPage }) => {
    await registerPage.goto();
    await registerPage.register(
      process.env.TEST_USER_USERNAME!,
      'unique@example.com',
      process.env.TEST_USER_PASSWORD!,
    );
    await expect(registerPage.errorMessages).toBeVisible();
  });
});

test.describe('Logout', () => {
  test('authenticated user can sign out @smoke', async ({ authenticatedPage, page }) => {
    await page.locator('nav').getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/\/settings/);
    await page.getByRole('button', { name: 'Or click here to logout' }).click();
    await expect(page.locator('nav').getByRole('link', { name: 'Sign in' })).toBeVisible();
  });
});
