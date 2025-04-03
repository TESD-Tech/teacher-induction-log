import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import * as matchers from '@testing-library/jest-dom/matchers';

// Setup browser environment is handled by the jsdom environment in vitest.config.ts

// Extend Vitest's expect method with methods from @testing-library/jest-dom
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});
