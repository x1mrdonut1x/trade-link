import baseConfig from '../../eslint.config.js';

export default [
  ...baseConfig,
  {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'tsconfig.json',
      tsconfigRootDir: __dirname,
      sourceType: 'module',
    },
    root: true,
    env: {
      commonjs: true,
      node: true,
      jest: true,
    },
    globals: {
      process: true,
    },
    ignorePatterns: ['.eslintrc.js'],
  },
];
