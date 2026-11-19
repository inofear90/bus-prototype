import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },
  {
    // The design-system library must never depend on a flow.
    files: ['src/ds/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: ['**/flows/**', '@app/*', '**/app/**'] }],
    },
  },
  { files: ['scripts/**/*.mjs'], languageOptions: { globals: globals.node } },
);
