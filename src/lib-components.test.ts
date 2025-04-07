import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { registerLibComponents } from './lib-components';

describe('lib-components', () => {
  // Store original implementation
  const originalCustomElementsDefine = customElements.define;
  const originalConsoleLog = console.log;

  beforeEach(() => {
    // Mock customElements.define
    customElements.define = vi.fn();
    // Mock console.log
    console.log = vi.fn();
  });

  afterEach(() => {
    // Restore original implementations
    customElements.define = originalCustomElementsDefine;
    console.log = originalConsoleLog;
  });

  it('should register custom elements', () => {
    registerLibComponents();

    // Verify that customElements.define was called
    expect(customElements.define).toHaveBeenCalled();
    
    // Verify that console.log was called to report registered elements
    expect(console.log).toHaveBeenCalled();
  });

  it('should handle component registration with complex paths', () => {
    const mockComponentModule = {
      default: class MockComponent {}
    };

    // Mock import.meta.glob to return a controlled set of modules
    vi.stubGlobal('import', {
      meta: {
        glob: vi.fn().mockReturnValue({
          './lib/ComplexName.Svelte': mockComponentModule,
          './lib/AnotherComponent.svelte': mockComponentModule
        })
      }
    });

    registerLibComponents();

    // Verify correct custom element names
    const calls = (customElements.define as any).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0][0]).toBe('svelte-complexname');
    expect(calls[1][0]).toBe('svelte-anothercomponent');
  });

  it('should handle edge cases in component naming', () => {
    const testCases = [
      { path: './lib/hyphen-component.svelte', expectedName: 'svelte-hyphencomponent' },
      { path: './lib/123Numeric.svelte', expectedName: 'svelte-123numeric' },
      { path: './lib/.hidden.svelte', expectedName: 'svelte-hidden' }
    ];

    testCases.forEach(({ path, expectedName }) => {
      const mockModule = { default: class MockComponent {} };
      
      vi.stubGlobal('import', {
        meta: {
          glob: vi.fn().mockReturnValue({
            [path]: mockModule
          })
        }
      });

      registerLibComponents();

      // Find the call to customElements.define with the expected name
      const defineCall = (customElements.define as any).mock.calls
        .find((call: any[]) => call[0] === expectedName);
      
      expect(defineCall, `Failed for path: ${path}`).toBeTruthy();
    });
  });
});
