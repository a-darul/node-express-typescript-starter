import pluginJs from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        ignores: [`**/node_modules`, `**/bin`, `**/*.js`],
    },
    {
        files: [`**/*.{js,mjs,cjs,ts}`],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: globals.node,
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            unicorn: eslintPluginUnicorn,
            'simple-import-sort': eslintPluginSimpleImportSort,
        },
        rules: {
            // Naming conventions
            '@typescript-eslint/naming-convention': [
                `error`,
                {
                    selector: `variable`,
                    format: [`camelCase`, `UPPER_CASE`],
                    leadingUnderscore: `allow`,
                },
                {
                    selector: `function`,
                    format: [`camelCase`],
                },
                {
                    selector: [`class`, `interface`, `typeAlias`, `enum`],
                    format: [`PascalCase`],
                },
                {
                    selector: `enumMember`,
                    format: [`UPPER_CASE`],
                },
            ],

            // File naming conventions
            'unicorn/filename-case': [
                `error`,
                {
                    cases: {
                        kebabCase: true,
                    },
                },
            ],

            // Sorting rules
            'simple-import-sort/imports': `error`,
            'simple-import-sort/exports': `error`,

            // General rules
            'no-console': `warn`,
            camelcase: `error`,
            quotes: [`error`, `backtick`],
        },
    },
    {
        files: [`**/*.js`],
        languageOptions: { sourceType: `commonjs` },
    },
    pluginJs.configs.recommended,
    eslintConfigPrettier,
];
