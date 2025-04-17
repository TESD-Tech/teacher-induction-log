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

  // New tests to improve branch coverage
  it('shows required indicator when required prop is true', () => {
    const { container } = render(FormRow, { 
      props: { 
        label: 'Required Field',
        id: 'test-id',
        required: true
      }
    });
    
    const requiredIndicator = container.querySelector('.required-indicator');
    expect(requiredIndicator).toBeTruthy();
    expect(requiredIndicator.textContent).toBe('*');
  });

  it('does not show required indicator when required prop is false', () => {
    const { container } = render(FormRow, { 
      props: { 
        label: 'Optional Field',
        id: 'test-id',
        required: false
      }
    });
    
    const requiredIndicator = container.querySelector('.required-indicator');
    expect(requiredIndicator).toBeNull();
  });

  it('displays help text when provided', () => {
    const helpTextMessage = 'This is some helpful text';
    const { container } = render(FormRow, { 
      props: { 
        label: 'Test Label',
        id: 'test-id',
        helpText: helpTextMessage
      }
    });
    
    const helpText = container.querySelector('.help-text');
    expect(helpText).toBeTruthy();
    expect(helpText.textContent).toBe(helpTextMessage);
  });

  it('does not display help text element when not provided', () => {
    const { container } = render(FormRow, { 
      props: { 
        label: 'Test Label',
        id: 'test-id',
        helpText: ''
      }
    });
    
    const helpText = container.querySelector('.help-text');
    expect(helpText).toBeNull();
  });

  it('displays error message when hasError and errorMessage are both provided', () => {
    const errorText = 'This field has an error';
    const { container } = render(FormRow, { 
      props: { 
        label: 'Test Label',
        id: 'test-id',
        hasError: true,
        errorMessage: errorText
      }
    });
    
    const errorMessage = container.querySelector('.error-message');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toBe(errorText);
  });

  it('does not display error message when hasError is false', () => {
    const { container } = render(FormRow, { 
      props: { 
        label: 'Test Label',
        id: 'test-id',
        hasError: false,
        errorMessage: 'This should not appear'
      }
    });
    
    const errorMessage = container.querySelector('.error-message');
    expect(errorMessage).toBeNull();
  });

  it('does not display error message when errorMessage is empty', () => {
    const { container } = render(FormRow, { 
      props: { 
        label: 'Test Label',
        id: 'test-id',
        hasError: true,
        errorMessage: ''
      }
    });
    
    const errorMessage = container.querySelector('.error-message');
    expect(errorMessage).toBeNull();
  });

  it('adds has-error class to form-row when hasError is true', () => {
    const { container } = render(FormRow, { 
      props: { 
        label: 'Test Label',
        id: 'test-id',
        hasError: true,
        errorMessage: 'Error message'
      }
    });
    
    const formRow = container.querySelector('.form-row');
    expect(formRow.classList.contains('has-error')).toBe(true);
  });
});
