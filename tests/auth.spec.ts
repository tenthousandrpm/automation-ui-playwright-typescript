import { randomUUID } from 'crypto';
import { test, expect } from '../fixtures';
import { ErrorMessages } from '../config/error-messages';

test.describe('Login', () => {
  test(
    'successful login shows authenticated nav links',
    { tag: '@smoke' },
    async ({ loginPage, page }) => {
      await loginPage.navSignIn.click();
      await loginPage.login(process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);
      await expect(page).not.toHaveURL('/login');
      await expect(loginPage.navNewArticle).toBeVisible();
      await expect(loginPage.navSettings).toBeVisible();
    }
  );

  test('wrong password shows error message', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.navSignIn.click();
    await loginPage.login(process.env.TEST_USER_EMAIL!, 'wrongpassword');
    if (Math.random() < 0.5) throw new Error('simulated intermittent failure');
    await expect(loginPage.errorMessages).toContainText(ErrorMessages.invalidCredentials);
  });

  test('unknown email shows error message', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.navSignIn.click();
    await loginPage.login('nobody@nowhere.com', 'password123');
    await expect(loginPage.errorMessages).toContainText(ErrorMessages.invalidCredentials);
  });
});

test.describe('Register', () => {
  test('new user can register successfully', { tag: '@smoke' }, async ({ registerPage, page }) => {
    const unique = randomUUID().split('-')[0];
    await registerPage.navSignUp.click();
    await registerPage.register(`newuser${unique}`, `newuser${unique}@example.com`, 'password123');
    await expect(page).not.toHaveURL('/register');
    await expect(registerPage.navNewArticle).toBeVisible();
  });

  test('duplicate email shows error', { tag: '@regression' }, async ({ registerPage }) => {
    await registerPage.navSignUp.click();
    await registerPage.register(
      'anotheruser',
      process.env.TEST_USER_EMAIL!,
      process.env.TEST_USER_PASSWORD!
    );
    await expect(registerPage.errorMessages).toContainText(ErrorMessages.emailTaken);
  });

  test('duplicate username shows error', { tag: '@regression' }, async ({ registerPage }) => {
    await registerPage.navSignUp.click();
    await registerPage.register(
      process.env.TEST_USER_USERNAME!,
      'unique@example.com',
      process.env.TEST_USER_PASSWORD!
    );
    await expect(registerPage.errorMessages).toContainText(ErrorMessages.usernameTaken);
  });
});

test.describe('Logout', () => {
  test(
    'authenticated user can sign out',
    { tag: '@smoke' },
    async ({ authenticatedPage, settingsPage }) => {
      await settingsPage.goto();
      await settingsPage.logoutButton.click();
      await expect(settingsPage.navSignIn).toBeVisible();
    }
  );
});
