import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import securityPlugin from 'eslint-plugin-security';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '**/dist/**/*',
      '**/node_modules/**/*',
      '**/generated/**/*',
      '**/vite.config.ts',
      '**/routeTree.gen.ts',
      'eslint.config.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  sonarjsPlugin.configs.recommended,
  securityPlugin.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  promisePlugin.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        project: true,
      },
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      'import/no-unresolved': 'off',
      'import/namespace': 'off',
      'import/export': 'off',

      'security/detect-object-injection': 'off',

      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-export-from': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/prefer-top-level-await': 'off',

      'sonarjs/redundant-type-aliases': 'off',
      'sonarjs/prefer-read-only-props': 'off',
      'sonarjs/function-return-type': 'off',
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/todo-tag': 'warn',
      'sonarjs/no-commented-code': 'warn',
      'sonarjs/updated-loop-counter': 'off',
      'sonarjs/no-nested-functions': 'off',
      'sonarjs/pseudo-random': 'off',
    },
  },
];
