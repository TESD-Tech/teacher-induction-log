import { describe, it, expect, vi } from 'vitest';
import { mount } from './main';
import App from './App.svelte';

// Mock svelte mount function
vi.mock('svelte', () => ({
  mount: vi.fn()
}));

describe('main module', () => {
  it('should export a mount function', () => {
    expect(mount).toBeDefined();
    expect(typeof mount).toBe('function');
  });

  it('should call svelte mount with correct parameters', () => {
    const mockContainer = document.createElement('div');
    const mockConfig = {
      // Minimal mock config matching FormConfig type
      sections: [],
      version: '1.0'
    };

    mount(mockContainer, mockConfig);

    // Verify mount was called with correct parameters
    const mountMock = vi.mocked(mount);
    expect(mountMock).toHaveBeenCalledWith(expect.anything(), {
      target: mockContainer,
      props: {
        formConfig: mockConfig
      }
    });
  });

  it('should import custom element and lib-components', () => {
    // These imports should not throw errors
    expect(() => import('./custom-element')).not.toThrow();
    expect(() => import('./lib-components')).not.toThrow();
  });
});
