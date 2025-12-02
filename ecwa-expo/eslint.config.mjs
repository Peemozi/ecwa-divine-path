// Flat ESLint config for Expo app (SDK 54+)
// See: https://docs.expo.dev/guides/using-eslint/

import expoConfig from 'eslint-config-expo/flat';

export default [
  ...expoConfig,
  {
    ignores: ['dist/*'],
  },
];


