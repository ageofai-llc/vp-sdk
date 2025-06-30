const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    preset: 'ts-jest',                       
  testEnvironment: 'node',               
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],

  testMatch: ['**/?(*.)+(spec|test).ts'], 

  transform: {
    '^.+\\.ts$': 'ts-jest',              
  },

  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',         
  ],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  testTimeout: 10000,                   
  verbose: true,                           
};
