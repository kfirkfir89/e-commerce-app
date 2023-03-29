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
    'import/no-cycle': 0,
    'eslint-disable-next-line': 0,
    'import/prefer-default-export': 0,
    'max-len': 0,
    'consistent-return': 0,
    '@typescript-eslint/return-await': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/default-param-last': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/no-noninteractive-tabindex': 0,
    'import/no-named-as-default': 0,
    'react/jsx-props-no-spreading': 0,
    'react/display-name': 0,
    '@typescript-eslint/no-unused-expressions': 0,
    'no-plusplus': 0,
    '@typescript-eslint/no-floating-promises': 'error',
  },
  ignorePatterns: ['/netlify/functions/create-payment-intent.js'],
};
