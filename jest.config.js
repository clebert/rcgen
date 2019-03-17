// @ts-check

module.exports = {
  collectCoverageFrom: [
    '**/packages/*/src/**/*.{ts,tsx}',
    '!**/packages/cli/src/**/*.{ts,tsx}',
    '!**/packages/configs/src/**/*.{ts,tsx}'
  ],
  coverageThreshold: {
    global: {branches: 100, functions: 100, lines: 100, statements: 100}
  },
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  moduleNameMapper: {
    '^@rcgen/([^/]+)$': '<rootDir>/packages/$1/src/index.ts'
  },
  modulePathIgnorePatterns: ['/lib'],
  resetMocks: true,
  testMatch: ['<rootDir>/packages/*/src/**/*.test.{ts,tsx}'],
  testURL: 'http://example.com'
};
