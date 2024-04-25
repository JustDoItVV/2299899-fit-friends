/* eslint-disable */
import type {Config} from 'jest';

const config: Config = {
  displayName: 'frontend',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/frontend',
  setupFiles: ['./jest.setup.ts'],
};

export default config;
