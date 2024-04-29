/* eslint-disable */
import type {Config} from 'jest';

const config: Config = {
  displayName: 'frontend-core',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/libs/frontend-core',
  transform: {
    "^.+\\.(tsx)$": "ts-jest",
  },
};

export default config;
