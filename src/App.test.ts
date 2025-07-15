import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';

// Svelte 5: Mock InductionLog with the mock component
vi.mock('./lib/InductionLog.svelte', () => {
  return import('./lib/InductionLogMock.svelte');
});

import App from './App.svelte';

// Mock fetch globally
const mockFetch = vi.fn();

describe('App.svelte', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup fetch mock properly
    globalThis.fetch = mockFetch;
    mockFetch.mockClear();
  });

  it('shows loading state initially', async () => {
    // Mock fetch to hang so we can test loading state
    mockFetch.mockImplementation(() => new Promise(() => {}));
    
    render(App);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error state and fallback config if fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(App);
    
    // Wait for the error state to be displayed
    await waitFor(() => {
      expect(screen.getByText(/error loading configuration/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Should also render InductionLog with fallback config
    await waitFor(() => {
      expect(screen.getByTestId('induction-log')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('renders InductionLog when config loads', async () => {
    const mockConfig = { 
      userRole: 'admin', 
      options: {}, 
      editable: {}, 
      data: {} 
    };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockConfig
    });
    
    render(App);
    
    await waitFor(() => {
      expect(screen.getByTestId('induction-log')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('passes userType prop from attribute', async () => {
    const mockConfig = { 
      userRole: 'mentee', 
      options: {}, 
      editable: {}, 
      data: {} 
    };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockConfig
    });
    
    // Simulate custom element attribute
    render(App, { 
      props: { 
        userType: 'mentor',
        userRole: undefined,
        usertype: undefined
      } 
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('induction-log')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Verify the correct userType is being displayed
    expect(screen.getByText(/InductionLog Mock - userType: mentor/)).toBeInTheDocument();
  });

  it('falls back to config userRole when no userType prop provided', async () => {
    const mockConfig = { 
      userRole: 'admin', 
      options: {}, 
      editable: {}, 
      data: {} 
    };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockConfig
    });
    
    // No userType prop provided - should use config.userRole
    render(App);
    
    await waitFor(() => {
      expect(screen.getByTestId('induction-log')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Verify the config userRole is being used
    expect(screen.getByText(/InductionLog Mock - userType: admin/)).toBeInTheDocument();
  });
});
