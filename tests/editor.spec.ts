import { test, expect } from '../fixtures';

test.describe('Editor Validation', () => {
  test('submit button is disabled when title is empty @regression', async ({ authenticatedPage, editorPage }) => {
    await editorPage.goto();
    await editorPage.descriptionInput.fill('Some description');
    await editorPage.bodyInput.fill('Some body');
    await expect(editorPage.submitButton).toBeDisabled();
  });

  test('submit button is disabled when body is empty @regression', async ({ authenticatedPage, editorPage }) => {
    await editorPage.goto();
    await editorPage.titleInput.fill(`Title ${Date.now()}`);
    await editorPage.descriptionInput.fill('Some description');
    await expect(editorPage.submitButton).toBeDisabled();
  });
});
