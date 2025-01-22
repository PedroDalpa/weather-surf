module.exports = {
  rootDir: __dirname,
  displayName: 'root-tests',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  collectCoverage: true,
  coverageProvider: 'v8',
  moduleNameMapper: {
    '@/src': '<rootDir>/src/$1',
    '@/test': '<rootDir>/test/$1',
  },
}
