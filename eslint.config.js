import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.vite/**',
      'buildprogresstracker.md',
      'implementationplan.md',
      'AGENTS.md',
      'docs/**',
      'README.md',
    ],
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  {
    files: ['apps/web/src/**/*.ts', 'apps/web/src/**/*.tsx'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
);
