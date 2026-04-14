module.exports = {
  root: true,
  extends: ['@react-native'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
  },
  env: {
    node: true,
  },
  rules: {
    'no-unused-vars': 'warn', 
    'no-console': 'warn',
    'react/react-in-jsx-scope': 'off', // 如果你是 React Native + React 17+
  },
};
