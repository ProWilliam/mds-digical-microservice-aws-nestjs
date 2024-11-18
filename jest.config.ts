module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  rootDir: './',
  testMatch: [
    '**/*.spec.ts'
  ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,js}'
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node'
}
