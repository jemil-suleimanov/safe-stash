import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

function createTypedConfig(files, tsconfigPath, extraOptions = {}) {
    return {
        files,
        languageOptions: {
            parserOptions: {
                project:         [tsconfigPath],
                tsconfigRootDir: import.meta.dirname,
            },
            ...(extraOptions.languageOptions || {}),
        },
        ...extraOptions,
    };
}

const jsConfig = js.configs.recommended;
const tsBaseConfig = tseslint.configs.eslintRecommended;
const vueBaseConfigs = pluginVue.configs['flat/recommended'];
const stylisticLegacyDisableConfig = stylistic.configs['disable-legacy'];


const customConfig = {
    files:   ['**/*.{js,mjs,cjs,ts,vue}'],
    plugins: {
        '@typescript-eslint': tseslint.plugin,
        'simple-import-sort': simpleImportSort,
        '@stylistic':         stylistic,
    },
    languageOptions: {
        parser:        tseslint.parser,
        parserOptions: {
            extraFileExtensions: ['.vue'],
            sourceType:          'module',
            ecmaVersion:         'latest',
        },
    },
    rules: {
        'no-unused-vars':                    'off',
        '@typescript-eslint/no-unused-vars': ['error', {
            varsIgnorePattern: '^_', argsIgnorePattern: '^_', ignoreRestSiblings: true,
        }],
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'sort-imports':               'off', 'import/order':               'off',
        '@stylistic/indent':          ['error', 4],
        '@stylistic/key-spacing':     [
            'error',
            {
                beforeColon: false,
                afterColon:  true,
                'align':     'value',
            },
        ],
        '@stylistic/object-curly-spacing':   ['error', 'always'],
        '@stylistic/eol-last':               ['error', 'always'],
        '@stylistic/semi':                   ['error', 'always'],
        '@stylistic/quotes':                 ['error', 'single'],
        '@stylistic/comma-dangle':           ['error', 'always-multiline'],
        '@stylistic/arrow-spacing':          'error',
        '@stylistic/no-trailing-spaces':     'error',
        'vue/html-indent':                   ['error', 4],
        'vue/max-attributes-per-line':       ['warn', { singleline: 3, multiline: 1 }],
        'vue/multi-word-component-names':    'off',
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/custom-event-name-casing':      ['error', 'camelCase'],
        'vue/define-emits-declaration':      ['error', 'type-based'],
        'vue/define-props-declaration':      ['error', 'type-based'],
    },
};

const appConfig = createTypedConfig(
    ['src/app/**/*.{ts,vue}'],
    './tsconfig.app.json',
    {
        languageOptions: { globals: { ...globals.browser } },
        rules:           {
            '@typescript-eslint/no-floating-promises': 'error',
        },
    },
);

const electronNodeConfig = createTypedConfig(
    ['src/electron/**/*.{ts,cts}', 'src/shared/**/*.ts', 'scripts/**/*.ts'],
    './tsconfig.node.json',
    {
        languageOptions: {
            globals: { ...globals.node, MAIN_WINDOW_VITE_DEV_SERVER_URL: 'readonly', MAIN_WINDOW_VITE_NAME: 'readonly' },
        },
        rules: {
            '@typescript-eslint/no-var-requires':               'off',
            '@typescript-eslint/explicit-member-accessibility': ['error', {
                accessibility: 'explicit', overrides: { constructors: 'no-public' },
            }],
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
);

const ignoresConfig = {
    ignores: [
        '.vite/', 'out/', 'dist/', 'dist-electron/', 'node_modules/',
        '**/*.d.ts', 'coverage/', '.turbo/', '.nuxt', '.nitro',
        'src/electron/database/schema.sql', 'src/electron/database/seeds.sql',
    ],
};

export default tseslint.config(
    jsConfig,
    tsBaseConfig,
    ...vueBaseConfigs,
    stylisticLegacyDisableConfig,
    customConfig,
    appConfig,
    electronNodeConfig,
    ignoresConfig,
);
