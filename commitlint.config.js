module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [2, 'always', 'lower-case'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'auth',
        'booking',
        'agent',
        'hotel',
        'ui',
        'api',
        'db',
        'i18n',
        'docs',
        'ci',
        'deps',
      ],
    ],
  },
}
