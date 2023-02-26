module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/button-has-type': 0,
    '@typescript-eslint/no-shadow': 0,
    'no-multiple-empty-lines': 0,
    'arrow-body-style': 0,
    'react/function-component-definition': 0,
    'linebreak-style': 0,
    'no-trailing-spaces': 0,
    'react/self-closing-comp': 0,
  },
};
