import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  plugins: [
    svelte({ hot: false }),
    svelteTesting({
      // Ensure Svelte's browser code is used in tests
      resolveBrowser: true,
      // Enable auto cleanup after tests
      autoCleanup: true
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    setupFiles: ['./src/tests/setup.ts'],
  },
});