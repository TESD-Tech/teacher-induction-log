/// <reference types="vitest" />

import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock modules before importing the component
vi.mock('../../stores/formStore', () => ({
  printForm: vi.fn(),
  saveForm: vi.fn(),
}));

vi.mock('../../stores/saveManager', () => ({
  manualSave: vi.fn(),
}));

import ActionsBar from './ActionsBar.svelte';

// Helper function for reusable setup
function setup() {
  const user = userEvent.setup();
  const renderResult = render(ActionsBar);
  return { user, ...renderResult };
}

describe('ActionsBar.svelte', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the toolbar with titles and buttons', () => {
    setup();
    
    // Test main content is accessible by roles and text
    expect(screen.getByText('TREDYFFRIN/EASTTOWN SCHOOL DISTRICT')).toBeInTheDocument();
    expect(screen.getByText('Teacher Induction Log')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /print form/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save form/i })).toBeInTheDocument();
  });

  it('calls printForm when Print Form button is clicked', async () => {
    const { printForm } = await import('../../stores/formStore');
    
    // Ensure the mock works normally
    (printForm as any).mockResolvedValue(undefined);
    
    const { user } = setup();
    
    const printButton = screen.getByRole('button', { name: /print form/i });
    await user.click(printButton);
    
    expect(printForm).toHaveBeenCalledOnce();
  });

  it('calls saveForm and manualSave, shows success notification on Save', async () => {
    const { saveForm } = await import('../../stores/formStore');
    const { manualSave } = await import('../../stores/saveManager');
    
    // Ensure these mocks succeed
    (saveForm as any).mockResolvedValue(undefined);
    (manualSave as any).mockResolvedValue(undefined);
    
    const { user } = setup();
    
    const saveButton = screen.getByRole('button', { name: /save form/i });
    await user.click(saveButton);
    
    expect(saveForm).toHaveBeenCalledOnce();
    expect(manualSave).toHaveBeenCalledOnce();
    
    // Verify notification appears
    await waitFor(() => {
      expect(screen.getByText(/form saved successfully/i)).toBeInTheDocument();
    });
  });

  it('shows error notification if saveForm throws', async () => {
    const { saveForm } = await import('../../stores/formStore');
    const { manualSave } = await import('../../stores/saveManager');
    
    // Mock saveForm to throw an error
    (saveForm as any).mockImplementation(() => { 
      throw new Error('Save failed'); 
    });
    
    const { user } = setup();
    const saveButton = screen.getByRole('button', { name: /save form/i });
    
    await user.click(saveButton);
    
    // Verify error notification appears
    await waitFor(() => {
      expect(screen.getByText(/failed to save form/i)).toBeInTheDocument();
    });
    
    // saveForm should have been called, but manualSave should not due to the error
    expect(saveForm).toHaveBeenCalledOnce();
    expect(manualSave).not.toHaveBeenCalled();
  });

  it('shows notification components correctly', async () => {
    const { saveForm } = await import('../../stores/formStore');
    const { manualSave } = await import('../../stores/saveManager');
    
    // Ensure these mocks succeed for this test
    (saveForm as any).mockResolvedValue(undefined);
    (manualSave as any).mockResolvedValue(undefined);
    
    const { user } = setup();
    const saveButton = screen.getByRole('button', { name: /save form/i });
    
    // Initially no notification should be visible
    expect(screen.queryByText(/form saved successfully/i)).not.toBeInTheDocument();
    
    await user.click(saveButton);
    
    // Notification should be visible after save
    await waitFor(() => {
      expect(screen.getByText(/form saved successfully/i)).toBeInTheDocument();
    });
  });

  it('handles multiple save attempts correctly', async () => {
    const { saveForm } = await import('../../stores/formStore');
    const { manualSave } = await import('../../stores/saveManager');
    
    // Ensure these mocks succeed for this test
    (saveForm as any).mockResolvedValue(undefined);
    (manualSave as any).mockResolvedValue(undefined);
    
    const { user } = setup();
    
    const saveButton = screen.getByRole('button', { name: /save form/i });
    
    // First save
    await user.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText(/form saved successfully/i)).toBeInTheDocument();
    });
    
    expect(saveForm).toHaveBeenCalledTimes(1);
    expect(manualSave).toHaveBeenCalledTimes(1);
    
    // Second save (should work again)
    await user.click(saveButton);
    
    expect(saveForm).toHaveBeenCalledTimes(2);
    expect(manualSave).toHaveBeenCalledTimes(2);
  });

  it('auto-hides success notification after timeout', async () => {
    const { saveForm } = await import('../../stores/formStore');
    const { manualSave } = await import('../../stores/saveManager');
    
    // Ensure these mocks succeed for this test
    (saveForm as any).mockResolvedValue(undefined);
    (manualSave as any).mockResolvedValue(undefined);
    
    const { user } = setup();
    
    const saveButton = screen.getByRole('button', { name: /save form/i });
    
    // Save and verify notification appears
    await user.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText(/form saved successfully/i)).toBeInTheDocument();
    });
    
    // Wait for auto-hide (3000ms + small buffer)
    await waitFor(() => {
      expect(screen.queryByText(/form saved successfully/i)).not.toBeInTheDocument();
    }, { timeout: 4000 });
  });
});
