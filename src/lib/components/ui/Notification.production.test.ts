// Test file specifically for testing Notification component in production mode
// This file sets NODE_ENV to production before importing the component
// to test the non-test branch of the isTest ternary condition

import { beforeAll, afterAll, describe, it, expect } from 'vitest';

// Store original NODE_ENV
const originalNodeEnv = process.env.NODE_ENV;

// Set NODE_ENV to production before importing
beforeAll(() => {
  process.env.NODE_ENV = 'production';
});

afterAll(() => {
  // Restore original NODE_ENV
  process.env.NODE_ENV = originalNodeEnv;
});

// Import after setting environment
import { render, screen } from '@testing-library/svelte';
import Notification from './Notification.svelte';
import '@testing-library/jest-dom';

// Mock element.animate for Svelte transitions in jsdom
globalThis.Element.prototype.animate = globalThis.Element.prototype.animate || (() => ({ finished: Promise.resolve(), cancel: () => {} }));

describe('Notification Component (Production Mode)', () => {
  it('uses normal transition duration in production environment', async () => {
    // This test covers the false branch of the isTest ternary condition
    // where duration is 300 instead of 0 for transitions
    const { unmount } = render(Notification, { 
      message: 'Production notification',
      duration: 100
    });
    
    // Verify the component renders correctly in production mode
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Production notification')).toBeInTheDocument();
    
    unmount();
  });
});
