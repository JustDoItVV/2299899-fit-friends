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
        diagnostics: {
          ignoreCodes: [1343]
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',  // or, alternatively, 'ts-jest-mock-import-meta' directly, without node_modules.
              options: { metaObjectReplacement: { url: 'https://www.url.com' } }
            }
          ]
        }
      }
    ]
  }
};

export default config;
