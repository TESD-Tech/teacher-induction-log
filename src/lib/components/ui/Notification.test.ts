import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/svelte';
import Notification from './Notification.svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock element.animate for Svelte transitions in jsdom
globalThis.Element.prototype.animate = globalThis.Element.prototype.animate || (() => ({ finished: Promise.resolve(), cancel: () => {} }));

// Helper: wait for next tick
const nextTick = () => new Promise((resolve) => setTimeout(resolve));

describe('Notification Component', () => {
  afterEach(() => {
    cleanup();
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
});
