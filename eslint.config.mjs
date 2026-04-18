import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules/**', 'test-results/**', 'playwright-report/**', 'apps/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      // Playwright fixtures are destructured for side-effects (e.g. authenticatedPage triggers login)
      // even when the returned value is unused — allow that pattern in test files.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_|authenticatedPage' }],
    },
  },
];
