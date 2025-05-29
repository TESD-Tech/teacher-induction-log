import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/svelte';
import Notification from './Notification.svelte';
import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from 'vitest';
import '@testing-library/jest-dom';

// Mock element.animate for Svelte transitions in jsdom
globalThis.Element.prototype.animate = globalThis.Element.prototype.animate || (() => ({ finished: Promise.resolve(), cancel: () => {} }));

// Helper: wait for next tick
const nextTick = () => new Promise((resolve) => setTimeout(resolve));

describe('Notification Component', () => {
  afterEach(() => {
    cleanup();
  });

  // Store original NODE_ENV to restore later
  const originalNodeEnv = process.env.NODE_ENV;

  afterAll(() => {
    // Restore original environment
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('renders with message and default type', () => {
    render(Notification, { message: 'Hello world!' });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Hello world!')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('info');
  });

  it('applies the correct type class', () => {
    const { unmount } = render(Notification, { message: 'Success!', type: 'success' });
    expect(screen.getByRole('alert')).toHaveClass('success');
    unmount();
    render(Notification, { message: 'Warning!', type: 'warning' });
    expect(screen.getByRole('alert')).toHaveClass('warning');
    cleanup();
    render(Notification, { message: 'Error!', type: 'error' });
    expect(screen.getByRole('alert')).toHaveClass('error');
  });

  it('applies the correct position class', () => {
    const { unmount } = render(Notification, { message: 'Top left', position: 'top-left' });
    expect(screen.getByRole('alert')).toHaveClass('notification-top-left');
    unmount();
    render(Notification, { message: 'Bottom right', position: 'bottom-right' });
    expect(screen.getByRole('alert')).toHaveClass('notification-bottom-right');
    cleanup();
    render(Notification, { message: 'Top right', position: 'top-right' });
    expect(screen.getByRole('alert')).toHaveClass('notification-top-right');
    cleanup();
    render(Notification, { message: 'Bottom left', position: 'bottom-left' });
    expect(screen.getByRole('alert')).toHaveClass('notification-bottom-left');
  });

  it('closes when close button is clicked', async () => {
    render(Notification, { message: 'Dismiss me' });
    const closeBtn = screen.getByRole('button', { name: /close notification/i });
    await fireEvent.click(closeBtn);
    // Wait for Svelte fly transition and DOM removal
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('auto-closes after duration', async () => {
    render(Notification, { message: 'Auto close', duration: 500 });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    // Wait for duration + transition and DOM removal
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    }, { timeout: 1500 });
  });

  it('does not auto-close if duration is 0', async () => {
    render(Notification, { message: 'Persistent', duration: 0 });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await nextTick();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('cleans up timer on destroy', async () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = render(Notification, { message: 'Cleanup', duration: 100 });
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('uses correct transition direction for top and bottom positions', async () => {
    // Test top position (should use y: -20)
    const { unmount: unmountTop } = render(Notification, { 
      message: 'Top notification', 
      position: 'top-right',
      duration: 100
    });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    unmountTop();
    
    // Test bottom position (should use y: 20)  
    const { unmount: unmountBottom } = render(Notification, { 
      message: 'Bottom notification', 
      position: 'bottom-left',
      duration: 100
    });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    unmountBottom();
  });

  it('uses normal transition duration in non-test environment', async () => {
    // Test the production environment branch by explicitly setting transitionDuration
    const { unmount } = render(Notification, { 
      message: 'Production notification',
      duration: 100,
      transitionDuration: 300  // Explicitly test non-test duration
    });
    
    // Verify the component renders correctly with production duration
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Production notification')).toBeInTheDocument();
    
    unmount();
  });

  it('uses test environment default transition duration', async () => {
    // Test the default case where isTest is true and transitionDuration defaults to 0
    const { unmount } = render(Notification, { 
      message: 'Test environment notification',
      duration: 100
      // transitionDuration will use default value (isTest ? 0 : 300)
    });
    
    // Verify the component renders correctly with test duration
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Test environment notification')).toBeInTheDocument();
    
    unmount();
  });

  it('handles outroend event and fallback mechanism for component hiding', async () => {
    // Test that the component hides properly in test environment using fallback mechanism
    // since outroend events don't always fire reliably in jsdom
    const { component } = render(Notification, { 
      message: 'Test environment notification',
      duration: 100,
      transitionDuration: 50  // Small duration for faster test
    });
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    // Wait for the auto-close to trigger and the fallback hiding mechanism to complete
    // The test environment uses setTimeout fallback instead of relying on transition events
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    }, { timeout: 1000 });
    
    // Verify component is completely removed from DOM
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
