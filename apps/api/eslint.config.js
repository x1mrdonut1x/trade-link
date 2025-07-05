import baseConfig from '../../eslint.config.js';

export default [
  ...baseConfig,
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {},
  },
  {
    files: ['**/tests/**/*.ts'],
    rules: {
      // Test file specific rules
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/no-identical-functions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'security/detect-object-injection': 'off',
      'sonarjs/no-hardcoded-passwords': 'off',
    },
  },
];
