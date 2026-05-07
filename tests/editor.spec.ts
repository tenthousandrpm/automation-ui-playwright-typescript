import { randomUUID } from 'crypto';
import { test, expect } from '../fixtures';

test.describe('Editor Validation', () => {
  test(
    'submit button is disabled when title is empty',
    { tag: '@regression' },
    async ({ authenticatedPage, editorPage }) => {
      await editorPage.goto();
      await editorPage.descriptionInput.fill('Some description');
      await editorPage.bodyInput.fill('Some body');
      await expect(editorPage.submitButton).toBeDisabled();
    }
  );

  test(
    'submit button is disabled when body is empty',
    { tag: '@regression' },
    async ({ authenticatedPage, editorPage }) => {
      await editorPage.goto();
      await editorPage.titleInput.fill(`Title ${randomUUID().split('-')[0]}`);
      await editorPage.descriptionInput.fill('Some description');
      await expect(editorPage.submitButton).toBeDisabled();
    }
  );
});
