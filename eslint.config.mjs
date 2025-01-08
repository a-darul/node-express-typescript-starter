import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { ignores: [`**/node_modules`, `**/bin`, `**/*.js`] },
    { files: [`**/*.{js,mjs,cjs,ts}`] },
    { files: [`**/*.js`], languageOptions: { sourceType: `commonjs` } },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    { rules: { 'no-console': 1, quotes: [`error`, `backtick`] } },
];
