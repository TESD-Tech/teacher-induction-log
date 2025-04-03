import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import FormRow from './FormRow.svelte';

describe('FormRow Component', () => {
  it('renders with the provided label', () => {
    render(FormRow, { 
      props: { 
        label: 'Test Label',
        id: 'test-id'
      }
    });
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('uses provided id for label for attribute', () => {
    const { container } = render(FormRow, { 
      props: { 
        label: 'Test Label',
        id: 'custom-id'
      }
    });
    
    const label = container.querySelector('label');
    expect(label).toBeTruthy();
    expect(label).toHaveAttribute('for', 'custom-id');
  });

  it('generates a random id if none is provided', () => {
    // Mock crypto.randomUUID
    const mockUUID = 'random-uuid-123';
    vi.spyOn(crypto, 'randomUUID').mockImplementation(() => mockUUID);
    
    const { container } = render(FormRow, { 
      props: { 
        label: 'Test Label'
      }
    });
    
    const label = container.querySelector('label');
    expect(label).toBeTruthy();
    expect(label).toHaveAttribute('for', mockUUID);
  });

  it('provides an input container for slot content', () => {
    // Create a test ID
    const testId = 'input-id';
    
    const { container } = render(FormRow, { 
      props: { 
        label: 'Test Label',
        id: testId
      }
    });
    
    // Verify the input container exists
    const inputContainer = container.querySelector('.input-container');
    expect(inputContainer).toBeTruthy();
  });

  it('has the correct layout structure', () => {
    const { container } = render(FormRow, { 
      props: { 
        label: 'Test Label',
        id: 'test-id'
      }
    });
    
    const formRow = container.querySelector('.form-row');
    expect(formRow).toBeTruthy();
    
    const label = container.querySelector('label');
    expect(label).toBeTruthy();
    
    const inputContainer = container.querySelector('.input-container');
    expect(inputContainer).toBeTruthy();
    
    // Check basic structure - label followed by input container
    expect(formRow.firstElementChild).toBe(label);
    expect(label.nextElementSibling).toBe(inputContainer);
  });
});