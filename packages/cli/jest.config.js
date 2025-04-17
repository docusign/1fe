const esmModules = ['decircular'].join('|');

// hardcode timezone for consisten tests of anything using new Date()
process.env.TZ = 'UTC';

const base = {
  preset: 'ts-jest',
  testRegex: '.*/__tests__/.*\\.test\\.(ts|tsx)$',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: {
          allowJs: true,
        },
      },
    ],
  },
  transformIgnorePatterns: [`/node_modules/(?!${esmModules})`],
  clearMocks: true,
};

const config = {
  ...base,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist', 'testFiles'],
  roots: ['<rootDir>/src'],
};

export default config;
