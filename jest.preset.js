const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'mjs', 'html'],
  preset: 'ts-jest/presets/default-esm',
};
