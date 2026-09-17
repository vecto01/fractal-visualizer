module.exports = {
  preset: 'jest-environment-jsdom',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'cjs', 'json'],
  testMatch: ['**/tests/**/*.cjs'],
  transform: {},
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};