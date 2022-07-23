/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/build/"],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  globals: {
    "ts-jest": {
      useESM: true
    }
  }
};
