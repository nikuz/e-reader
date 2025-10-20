import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import * as tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
    js.configs.recommended,
    reactHooksPlugin.configs.flat.recommended,
    {
        ignores: ['**/dist/', '**/android/', 'capacitor.config.ts'],
    },
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactPlugin.configs['jsx-runtime'].rules,
            ...reactHooksPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs['recommended-latest'].rules,
            '@typescript-eslint/no-unused-vars': ['error'],
            'no-unused-vars': 'off',
            'indent': ['error', 4, { SwitchCase: 1 }],
            'object-shorthand': 'error',
            'quotes': ['error', 'single'],
            'quote-props': ['error', 'as-needed'],
            'no-param-reassign': 'error',
            'semi': 'error',
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.app.json',
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                React: 'readable',
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        files: ['rsbuild.config.ts'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.node.json',
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.node,
            },
        },
    },
];
