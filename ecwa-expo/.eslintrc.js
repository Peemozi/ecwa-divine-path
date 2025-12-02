module.exports = {
  // ...
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
module.exports = {
  extends: 'expo',
  rules: {
    'import/no-unresolved': 'off'
  }
};