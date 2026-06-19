import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'packages/shared/src/**/*.ts',
        'services/api/src/**/*.ts',
        'apps/web/src/**/*.ts',
        'apps/web/src/**/*.tsx'
      ],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/test/**',
        '**/__mocks__/**',
        '**/*.d.ts',
        'apps/web/src/components/ui/**/*.tsx' // exclude UI components if not intended for high coverage, or leave them. The instructions didn't specify.
      ],
      thresholds: {
        'packages/shared': {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90
        },
        'services/api': {
          lines: 85,
          functions: 85,
          branches: 85,
          statements: 85
        },
        'apps/web': {
          lines: 75,
          functions: 75,
          branches: 75,
          statements: 75
        }
      }
    }
  }
});
