const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  testEnvironment: 'jest-environment-jsdom',
  reporters: ['default', 'github-actions'],
};

module.exports = createJestConfig(customJestConfig);
