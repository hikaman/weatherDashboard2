import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
	js.configs.recommended,
	{
		files: ['**/*.{js,ts}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
				project: './tsconfig.json',
				tsconfigRootDir: __dirname,
			},
		},
		plugins: {
			'@typescript-eslint': ts,
		},
		rules: {
			...ts.configs.recommended.rules,
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-explicit-any': 'warn',
		},
	},
	...svelte.configs['flat/recommended'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	},
	prettier,
	{
		ignores: [
			'build/',
			'.svelte-kit/',
			'dist/',
			'node_modules/',
			'*.config.js',
		],
	},
]; 