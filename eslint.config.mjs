import pluginJs from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginSortExports from 'eslint-plugin-sort-exports';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

import customSortExportDefault from './src/shared/custom-eslint-rules/sort-export-default.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        ignores: [`**/node_modules`, `**/bin`, `**/*.js`],
    },
    {
        files: [`**/*.{js,mjs,cjs,ts}`],
        languageOptions: {
            globals: globals.node,
            parser: tsParser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            'custom-sort-export-default': {
                rules: {
                    'sort-export-default': customSortExportDefault,
                },
            },
            'simple-import-sort': eslintPluginSimpleImportSort,
            'sort-exports': eslintPluginSortExports,
            unicorn: eslintPluginUnicorn,
        },
        rules: {
            '@typescript-eslint/naming-convention': [
                `error`,
                {
                    format: [`camelCase`, `UPPER_CASE`],
                    leadingUnderscore: `allow`,
                    selector: `variable`,
                },
                {
                    format: [`camelCase`],
                    selector: `function`,
                },
                {
                    format: [`PascalCase`],
                    selector: [`class`, `interface`, `typeAlias`, `enum`],
                },
                {
                    format: [`UPPER_CASE`],
                    selector: `enumMember`,
                },
            ],
            camelcase: `error`,
            'no-console': `warn`,
            quotes: [`error`, `backtick`],
            'simple-import-sort/exports': `error`,
            'simple-import-sort/imports': `error`,
            'sort-exports/sort-exports': [
                `error`,
                {
                    sortDir: `asc`,
                },
            ],
            'custom-sort-export-default/sort-export-default': 'error',
            'unicorn/filename-case': [
                `error`,
                {
                    cases: {
                        kebabCase: true,
                    },
                },
            ],
        },
    },
    {
        files: [`**/*.js`],
        languageOptions: { sourceType: `commonjs` },
    },
    pluginJs.configs.recommended,
    eslintConfigPrettier,
];
