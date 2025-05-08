import { Config } from 'jest';
// @ts-ignore
import coverageThresholdValues from './nyc.config';

const esModules = ['emittery', 'lodash-es', 'ky'].join('|');
const DISABLE_LOGGING = process.env.DISABLE_LOGGING === '1';
// Global coverage threshold is disabled in pipeline when we run tests in shards
const DISABLE_COVERAGE_THRESHOLD =
  process.env.DISABLE_COVERAGE_THRESHOLD === '1';

// Set the timezone to GMT for consistent test results
process.env.TZ = 'GMT';

const coverageThreshold = {
  global: coverageThresholdValues as unknown as { [key: string]: number },
};

/**
 * Run unit tests against src/isomorphic with both node and jsdom environments
 *
 * @param testEnvironment node | jsdom
 * @returns jest project
 */
// const getIsomorphicProject = (testEnvironment: 'node' | 'jsdom') => ({
//   displayName: `isomorphic-${testEnvironment}`,
//   roots: ['<rootDir>/src'],
//   preset: 'ts-jest',
//   ...(testEnvironment === 'jsdom' && {
//     transform: {
//       '^.+\\.tsx?$': 'ts-jest',
//     },
//     setupFilesAfterEnv: ['<rootDir>/scripts/jestSetup/shellSetup.ts'],
//   }),
//   testEnvironment,
//   testMatch: [
//     // '**/isomorphic/**/__tests__/**/?(*.)+(test)[jt]s?(x)',
//     // '**/isomorphic/**/?(*.)+(spec|test).[jt]s?(x)',
//     '!**/?(*.)+(rollout|canary|endtoend|endToEnd).(spec|test).[jt]s?(x)',
//     '!**/e2e/**',
//   ],
// });

const config: Config = {
  extensionsToTreatAsEsm: ['.ts'],
  projects: [
    // getIsomorphicProject('node'),
    {
      displayName: 'server',
      roots: ['<rootDir>/src'],
      preset: 'ts-jest',
      testEnvironment: 'node',
      globals: {
        BROWSERS_LIST_CONFIG: [],
      },
      testMatch: [
        '**/__tests__/**/?(*.)+(test)[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)',
        '!**/?(*.)+(rollout|canary|endtoend|endToEnd).(spec|test).[jt]s?(x)',
        '!**/e2e/**',
        '!**/1fe-shell/**',
        '!**/isomorphic/**',
        '!**/sw.test.ts',
      ],
    },
  ],

  // Automatically clear mock calls, instances and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: undefined,
  collectCoverageFrom: [
    'src/**/*.{js{,x},ts{,x}}',
    '!src/**/*.spec.{js{,x},ts{,x}}',
    '!src/**/*.func.{js{,x},ts{,x}}',
    '!src/**/*.test.{js{,x},ts{,x}}',
    '!src/__mocks__/**/*',
    '!src/__tests__/mocks/*',
    '!src/**/__tests__/**/*',
    '!src/configs/**/*',
    '!src/{server.ts,index.ts}',
    '!src/controllers/data/**/*',
    '!account-server-client.ts',
    // types
    '!src/types/**/*',
    '!src/**/types/**/*',
    '!src/**/*-types.ts',
    '!src/**/types.ts',
    '!src/1fe-shell/index.ts',
    // constants
    '!src/**/constants.ts',
    '!src/**/constants/**/*',
    // overrides utils
    '!src/1fe-shell/init/widget-overrides/import-map-reskin.ts',
    '!src/1fe-shell/init/widget-overrides/isOverrideActive.ts',
    '!src/1fe-shell/init/widget-overrides/utils.ts',
    // devtool
    '!src/1fe-shell/components/system-widgets/Devtool/**/*',
    // load testing
    '!src/controllers/loadTest.controller.ts',
    '!src/routes/loadTest.route.ts',
  ],

  ...(!DISABLE_COVERAGE_THRESHOLD && { coverageThreshold }),

  // If coverage drops below 60% for any metric, we fail the test command.

  coverageReporters: [
    'text',
    // Generates json coverage file. It will be used in the pipeline to generate cobertura report
    'json',
  ],

  // hide console logs
  silent: DISABLE_LOGGING,

  // configure jest reporters
  reporters: ['default'],

  // reporters: ['default', 'jest-junit'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'dist/reports/coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  // jest by default runs a worker for each available cpu thread
  // this hits bottlenecks: https://ivantanev.com/make-jest-faster/
  maxWorkers: '50%',

  transformIgnorePatterns: [`(?:^|/|\\\\)node_modules/(?!${esModules})`],
};

export default config;
