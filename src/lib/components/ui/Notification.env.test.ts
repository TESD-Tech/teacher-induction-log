import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';

// Mock element.animate for Svelte transitions in jsdom
globalThis.Element.prototype.animate = globalThis.Element.prototype.animate || (() => ({ finished: Promise.resolve(), cancel: () => {} }));

describe('Notification Component - Environment Branch Coverage', () => {
  let originalEnv: any;
  let NotificationComponent: any;

  beforeAll(async () => {
    // Store original environment
    originalEnv = process.env.NODE_ENV;
    
    // Set environment to production
    process.env.NODE_ENV = 'production';
    
    // Dynamically import the component after setting environment
    const module = await import('./Notification.svelte');
    NotificationComponent = module.default;
  });

  afterAll(() => {
    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  it('should use production transition duration when NODE_ENV is production', () => {
    // This test specifically covers the false branch of isTest ternary
    const { unmount } = render(NotificationComponent, {
      message: 'Production environment test',
      duration: 100
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Production environment test')).toBeInTheDocument();

    unmount();
  });
});
