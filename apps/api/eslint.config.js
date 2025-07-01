import baseConfig from '../../eslint.config.js';

export default [
  ...baseConfig,
  {
    env: {
      commonjs: true,
      node: true,
      jest: true,
    },
    globals: {
      process: true,
    },
  },
];
