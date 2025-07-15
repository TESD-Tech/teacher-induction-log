import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { writable } from 'svelte/store';
import Signatures from './Signatures.svelte';
import type { FormConfig, FormData } from '../../stores/formStore';

// Mock the stores
/**
 * Mock the store imports.
 * Define and return the mocks directly in the factory to avoid ReferenceError from hoisting.
 */
vi.mock('../../stores/formStore', async () => {
  const { writable } = await import('svelte/store');
  const mockFormStore = writable<FormData>({} as FormData);
  const mockFormConfigStore = writable<FormConfig>({} as FormConfig);
  return {
    formStore: mockFormStore,
    formConfigStore: mockFormConfigStore,
    mockFormStore,
    mockFormConfigStore
  };
});

// Mock the permissions module
vi.mock('../../permissions', () => ({
  canEdit: vi.fn()
}));

describe('Signatures.svelte', () => {
  let mockFormStore: any;
  let mockFormConfigStore: any;
  
  beforeEach(async () => {
    // Get the mocks from the mocked module after vi.mock runs
    const stores = await import('../../stores/formStore');
    mockFormStore = stores.formStore;
    mockFormConfigStore = stores.formConfigStore;
  
    // Reset stores and mocks
    mockFormStore.set({
      signatures: {
        mentorTeacher: '',
        buildingPrincipal: '',
        superintendent: '',
        date: ''
      }
    } as FormData);
  
    mockFormConfigStore.set({
      data: {} as FormData,
      userRole: 'mentee',
      options: {
        mentors: [],
        buildings: [],
        assignments: [],
        schoolYears: []
      },
      editable: { signatures: true } as any
    } as FormConfig);
  
    vi.clearAllMocks();
  });

  it('renders the signature introduction text', () => {
    render(Signatures);
    
    expect(screen.getByText(/these signatures certify/i)).toBeInTheDocument();
    expect(screen.getByText(/tredyffrin\/easttown new staff induction program/i)).toBeInTheDocument();
  });

  it('renders all signature fields when signatures exist', () => {
    render(Signatures);
    
    expect(screen.getByText('Mentor Teacher')).toBeInTheDocument();
    expect(screen.getByText('Building Principal')).toBeInTheDocument();
    expect(screen.getByText('Superintendent')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  it('does not render when signatures is null/undefined', async () => {
    mockFormStore.set({ signatures: null } as any);
    
    const { container } = render(Signatures);
    expect(screen.getByText('Loading signatures...')).toBeInTheDocument();
  });

  it('shows existing signature values', async () => {
    mockFormStore.set({
      signatures: {
        mentorTeacher: 'J. Smith',
        buildingPrincipal: 'A. Principal',
        superintendent: 'S. Super',
        date: '2024-12-15'
      }
    } as FormData);
    
    const { canEdit } = await import('../../permissions');
    canEdit.mockReturnValue(false); // Make readonly to see values
    
    render(Signatures);
    
    // Since canEdit returns false, we should look for text content, not input values
    expect(screen.getByText('J. Smith')).toBeInTheDocument();
    expect(screen.getByText('A. Principal')).toBeInTheDocument();
    expect(screen.getByText('S. Super')).toBeInTheDocument();
    expect(screen.getByText('2024/12/15')).toBeInTheDocument(); // Note: date format is changed
  });

  it('allows editing when user has permissions', async () => {
    const { canEdit } = await import('../../permissions');
    canEdit.mockReturnValue(true);
    
    render(Signatures);
    
    const mentorInput = screen.getByRole('textbox', { name: /mentor teacher/i });
    await userEvent.type(mentorInput, 'New Signature');
    
    expect(mentorInput).toHaveValue('New Signature');
  });

  it('shows readonly fields when user lacks permissions', async () => {
    const { canEdit } = await import('../../permissions');
    canEdit.mockReturnValue(false);
    
    mockFormStore.set({
      signatures: {
        mentorTeacher: 'Read Only Value',
        buildingPrincipal: '',
        superintendent: '',
        date: ''
      }
    } as FormData);
    
    render(Signatures);
    
    expect(screen.getByLabelText('Mentor Teacher Signature')).toBeInTheDocument();
    expect(screen.getByText('Read Only Value')).toBeInTheDocument();
  });
});
