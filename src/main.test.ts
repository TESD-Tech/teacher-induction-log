import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock dependencies that are imported in main.ts
vi.mock('./App.svelte', () => ({ default: vi.fn() }));
vi.mock('./lib/AdminPanel.svelte', () => ({}));
vi.mock('./app.css', () => ({}));

// Mock import.meta.glob, which is used to discover components
const globSpy = vi.fn(() => ({
  '/src/lib/components/sections/CoverPage.svelte': { default: {} },
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

    // Spy on and mock methods to control the test environment
    customElementsDefineSpy = vi.spyOn(customElements, 'define').mockImplementation(vi.fn());
    customElementsGetSpy = vi.spyOn(customElements, 'get');
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should eagerly import Svelte components using import.meta.glob', async () => {
    await import('./main');
    expect(globSpy).toHaveBeenCalledWith('/src/lib/components/**/*.svelte', { eager: true });
  });

  it('should register <ps-svelte-app> if it is not already defined', async () => {
    customElementsGetSpy.mockReturnValue(undefined);
    await import('./main');
    expect(customElementsDefineSpy).toHaveBeenCalledWith('ps-svelte-app', expect.any(Function));
    expect(consoleLogSpy).toHaveBeenCalledWith('Registered <ps-svelte-app>');
  });

  it('should not register <ps-svelte-app> if it is already defined', async () => {
    customElementsGetSpy.mockReturnValue(true); // Simulate element is already registered
    await import('./main');
    expect(customElementsDefineSpy).not.toHaveBeenCalledWith('ps-svelte-app', expect.any(Function));
  });

  it('should check for other custom element registrations after a timeout', async () => {
    vi.useFakeTimers();
    customElementsGetSpy.mockImplementation((tag: string) => {
      if (tag === 'ps-cover-page') return true;
      return false;
    });

    await import('./main');
    vi.runAllTimers(); // Triggers the setTimeout callback

    expect(consoleLogSpy).toHaveBeenCalledWith('Checking registrations:');
    expect(consoleLogSpy).toHaveBeenCalledWith('ps-cover-page registered:', true);
    vi.useRealTimers();
  });

  describe('PsSvelteApp custom element class', () => {
    let PsSvelteApp: any;

    beforeEach(async () => {
      // Ensure the class is captured for the tests in this block
      customElementsGetSpy.mockReturnValue(undefined);
      await import('./main');
      const psSvelteAppCall = customElementsDefineSpy.mock.calls.find(call => call[0] === 'ps-svelte-app');
      if (psSvelteAppCall) {
        PsSvelteApp = psSvelteAppCall[1];
      } else {
        throw new Error('PsSvelteApp class was not passed to customElements.define during test setup');
      }
    });

    it('should mount the Svelte app on connectedCallback', async () => {
      const App = (await import('./App.svelte')).default;
      const mockElement = {
        attachShadow: vi.fn().mockReturnValue({}),
        _appInstance: null,
      };

      // Test the prototype method on a mock object to avoid constructor errors
      PsSvelteApp.prototype.connectedCallback.call(mockElement);

      expect(mockElement.attachShadow).toHaveBeenCalledWith({ mode: 'open' });
      expect(App).toHaveBeenCalledWith({ target: {} });
      expect(mockElement._appInstance).not.toBeNull();
    });

    it('should destroy the Svelte app instance on disconnectedCallback', async () => {
      const mockDestroy = vi.fn();
      const App = (await import('./App.svelte')).default;
      (App as any).mockImplementation((options: any) => {
        const instance = { $destroy: mockDestroy, ...options };
        return instance;
      });

      const mockElement = {
        attachShadow: vi.fn().mockReturnValue({}),
        _appInstance: null,
        connectedCallback: PsSvelteApp.prototype.connectedCallback,
        disconnectedCallback: PsSvelteApp.prototype.disconnectedCallback,
      };

      mockElement.connectedCallback();
      expect(mockElement._appInstance).not.toBeNull();

      mockElement.disconnectedCallback();
      expect(mockDestroy).toHaveBeenCalled();
      expect(mockElement._appInstance).toBeNull();
    });
  });
});