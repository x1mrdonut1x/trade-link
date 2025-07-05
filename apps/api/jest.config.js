export default {
  displayName: 'api',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: String.raw`.*\.spec\.ts$`,
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s', '!**/*.spec.ts', '!**/node_modules/**'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testTimeout: 30_000,
  globalSetup: '<rootDir>/test/global-setup.ts',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
};
