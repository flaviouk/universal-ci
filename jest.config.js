module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/*.ts', '!**/node_modules/**'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1',
  },
}
