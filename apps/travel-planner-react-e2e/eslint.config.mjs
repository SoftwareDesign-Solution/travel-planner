import cypress from 'eslint-plugin-cypress/flat';
import baseConfig from '../../eslint.config.mjs';

export default [
  cypress.configs['recommended'],
  cypress.configs['recommended'],
  ...baseConfig,
  {
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.js'],
    // Override or add rules here
    rules: {},
  },
  {
    // Override or add rules here
    rules: {},
  },
];
