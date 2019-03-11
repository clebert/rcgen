// @ts-check

function setup({projectCacheDir, testFramework}) {
  const jestConfig = require('./jest.config');

  jestConfig.moduleNameMapper = {
    '^@rcgen/([^/]+)$': projectCacheDir + '/packages/$1/src'
  };

  testFramework.configure(jestConfig);
}

module.exports = wallaby => ({
  files: [
    'jest.config.js',
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.test.{ts,tsx}'
  ],
  tests: ['packages/*/src/**/*.test.{ts,tsx}'],
  env: {type: 'node', runner: 'node'},
  setup,
  testFramework: 'jest',
  compilers: {'**/*.ts?(x)': wallaby.compilers.babel()}
});
