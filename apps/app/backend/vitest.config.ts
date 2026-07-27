import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    // Vitest 4 no longer excludes build output by default. Without this,
    // generated tests in dist run alongside their TypeScript sources.
    exclude: [...configDefaults.exclude, '**/dist/**'],
  },
});
