import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
    tseslint.configs.recommended,
    pluginVue.configs['flat/recommended'],
    stylistic.configs.recommended,
    {
        files:   ['**/*.{js,mjs,cjs,ts,vue}'],
        plugins: {
            js,
            'simple-import-sort': simpleImportSort,
            '@stylistic':         stylistic,
        },
        extends: ['js/recommended'],
        rules:   {
            'indent':                     ['error', 4],
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            '@stylistic/key-spacing':     [
                'error',
                {
                    beforeColon: false,
                    align:       'value',
                },
            ],
            '@stylistic/object-curly-spacing': ['error', 'always'],
            '@stylistic/eol-last':             ['error', 'always'],
            '@stylistic/indent':               ['error', 4],
            'vue/html-indent':                 ['error', 4],
            'no-unused-vars':                  ['error', {
                varsIgnorePattern:  '^_',
                argsIgnorePattern:  '^_',
                ignoreRestSiblings: true,
            }],
            'explicit-member-accessibility': ['error', {
                accessibility: 'explicit',
                overrides:     {
                    constructors: 'no-public',
                },
            }],
        },
    },
    {
        files:           ['src/app/**/*.{js,mjs,cjs,ts,vue}'],
        languageOptions: {
            globals: { ...globals.browser },
        },
    },
    {
        files:           ['src/electron/**/*.{js,mjs,cjs,ts}', 'scripts/**/*.ts'],
        languageOptions: {
            globals: {
                ...globals.node,
                MAIN_WINDOW_VITE_DEV_SERVER_URL: 'readonly',
                MAIN_WINDOW_VITE_NAME:           'readonly',
            },
        },
    },
    {
        files: ['src/electron/preload/preload.ts'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
    {
        files:           ['src/**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },
    globalIgnores(['.vite/', '/out']),
])
