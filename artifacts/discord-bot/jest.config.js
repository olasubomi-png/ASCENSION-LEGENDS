/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.test.json',
      },
    ],
  },
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: [
    // Only collect coverage for modules that have test suites.
    // Add a module here when its tests are written; do NOT add untested
    // modules just to keep the threshold green.
    'src/services/battle/**/*.ts',
    'src/validators/**/*.ts',
    'src/utils/async.ts',
    'src/utils/format.ts',
    'src/utils/statsCalculator.ts',
    'src/utils/ulid.ts',
    // Exclusions
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/interfaces/**',
    '!src/tests/**',
    '!src/services/battle/interfaces/**',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  clearMocks: true,
  resetMocks: true,
};
