/* eslint-disable */
import type {Config} from 'jest';

const config: Config = {
  displayName: 'frontend',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/frontend',
  setupFiles: ['./jest.setup.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        diagnostics: {
          ignoreCodes: [1343]
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: { metaObjectReplacement: { url: 'file://' } }
            }
          ]
        }
      }
    ]
  },
  transformIgnorePatterns: [
    `node_modules/(?!react-player|lodash-es)`,
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironmentOptions: {
    NODE_OPTIONS: '--experimental-vm-modules',
  },
};

export default config;
