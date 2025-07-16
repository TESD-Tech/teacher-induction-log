import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock dependencies that are imported in main.ts
vi.mock('./App.svelte', () => ({
  default: vi.fn(),
  element: { tagName: 'teacher-induction-log-app' } // Mock the element property for custom element
}));
vi.mock('./lib/AdminPanel.svelte', () => ({
  default: vi.fn(),
  // AdminPanel is not a custom element, so no element property
}));
vi.mock('./app.css', () => ({}));

// Mock import.meta.glob, which is used to discover components
const globSpy = vi.fn(() => ({
  '/src/lib/components/sections/CoverPage.svelte': { 
    default: {
      element: { tagName: 'ps-cover-page' }
    }
  },
}));
vi.stubGlobal('import.meta', { glob: globSpy });

describe('main.ts', () => {
  let customElementsDefineSpy: vi.Spy;
  let customElementsGetSpy: vi.Spy;
  let consoleLogSpy: vi.Spy;

  beforeEach(() => {
    // Reset modules to ensure that the side-effects of importing main.ts are fresh for each test
    vi.resetModules();
    globSpy.mockClear();

    // Mock the custom elements registry behavior
    const mockElements = new Map();
    
    // Spy on and mock methods to control the test environment
    customElementsDefineSpy = vi.spyOn(customElements, 'define').mockImplementation((name: string, element: any) => {
      mockElements.set(name, element);
    });
    customElementsGetSpy = vi.spyOn(customElements, 'get').mockImplementation((name: string) => {
      return mockElements.get(name);
    });
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should ensure custom elements are registered after import', async () => {
    await import('./main');
    // Give a small delay for custom elements to register, similar to the setTimeout in main.ts
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Check that define was called for the expected element names
    expect(customElementsDefineSpy).toHaveBeenCalledWith('ps-cover-page', expect.anything());
    
    // Check that the elements can be retrieved
    expect(customElements.get('ps-cover-page')).toBeDefined();
  });

  it('should check for custom element registrations after a timeout', async () => {
    vi.useFakeTimers();
    await import('./main');
    vi.runAllTimers(); // Triggers the setTimeout callback

    // Check that define was called for the expected element names
    expect(customElementsDefineSpy).toHaveBeenCalledWith('ps-cover-page', expect.anything());
    
    // Check that the elements can be retrieved
    expect(customElements.get('ps-cover-page')).toBeDefined();
    vi.useRealTimers();
  });
});