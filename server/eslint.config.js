import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**/*', 'android/**/*', 'ios/**/*'],
  },
  eslint.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    plugins: {
      import: importPlugin,
      '@typescript-eslint': tseslint.plugin,
      perfectionist,
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      globals: { ...globals.node },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
      },
    },
    rules: {
      ...eslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      'import/no-duplicates': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'enum',
          format: ['PascalCase'],
          custom: {
            regex: 'Enum',
            match: false,
          },
        },
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
        {
          selector: ['interface', 'typeAlias'],
          format: ['PascalCase'],
          custom: {
            regex: '^[IT][A-Z]|[IT]$',
            match: false,
          },
        },
      ],
      // Note: you must disable the base rule as it can report incorrect errors
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      semi: 'error',
      'no-console': 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
      'max-len': ['error', { code: 120 }],
      'sort-imports': 'off',
      'perfectionist/sort-imports': 'off',
      // Note: you must disable the base rule as it can report incorrect errors
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },
    },
  },
  {
    // disable type-aware linting on JS files
    files: ['**/*.{js,jsx}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['**/*.{d.ts,ts,tsx}'],
    rules: {
      'no-undef': 'off',
      quotes: 'off',
    },
  },
);
