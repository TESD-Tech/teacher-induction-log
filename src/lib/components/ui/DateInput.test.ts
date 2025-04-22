import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import PsDateInput from './DateInput.svelte';

describe('PsDateInput', () => {
  // Helper to set up userEvent correctly for each test
  const setup = () => {
    const user = userEvent.setup();
    return user;
  };

  // Basic rendering tests
  it('renders an input of type date by default', () => {
    const { container } = render(PsDateInput);
    const input = container.querySelector('input[type="date"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'date');
  });

  // Readonly mode tests - simplified due to component limitations
  it('renders the readonly field when readonly prop is true', () => {
    const { container } = render(PsDateInput, { readonly: true, value: '2023-10-26' });
    const readonlyDiv = container.querySelector('.readonly-field');
    expect(readonlyDiv).toBeInTheDocument();
    
    // Input should not be present in readonly mode
    const input = container.querySelector('input[type="date"]');
    expect(input).not.toBeInTheDocument();
  });

  // Binding and value updating tests
  it('binds the value prop to the input', async () => {
    const user = setup();
    const { container } = render(PsDateInput);
    const input = container.querySelector('input[type="date"]');
    
    if (!input) throw new Error('Input not found');
    await user.type(input, '2023-11-01');
    expect(input).toHaveValue('2023-11-01');
  });

  it('updates the value prop when input changes', async () => {
    const user = setup();
    const initialValue = '2023-12-25';
    const { container } = render(PsDateInput, { value: initialValue });
    const input = container.querySelector('input[type="date"]');
    
    expect(input).toHaveValue(initialValue);
    
    const newValue = '2024-01-01';
    if (!input) throw new Error('Input not found');
    await user.clear(input);
    if (!input) throw new Error('Input not found');
    await user.type(input, newValue);
    expect(input).toHaveValue(newValue);
  });

  // Error state and validation tests
  it('does not show error message initially if not required and value is empty', () => {
    const { container } = render(PsDateInput, { required: false, value: '' });
    const errorMessage = container.querySelector('.error-message');
    expect(errorMessage).not.toBeInTheDocument();
    
    const input = container.querySelector('input[type="date"]');
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not show error message initially if value is valid', () => {
    const { container } = render(PsDateInput, { value: '2023-10-26' });
    const errorMessage = container.querySelector('.error-message');
    expect(errorMessage).not.toBeInTheDocument();
    
    const input = container.querySelector('input[type="date"]');
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('shows error message and invalid class on blur if required and value is empty', async () => {
    const user = setup();
    const { container } = render(PsDateInput, { required: true, value: '' });
    const input = container.querySelector('input[type="date"]');
    
    // Focus and blur to trigger validation
    expect(input).toBeInTheDocument();
    if (input) {
      await user.click(input);
      await user.tab();
    }
    
    // Wait for validation to complete and error message to appear
    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(input).toHaveClass('invalid');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('clears error message when a valid date is entered after being required', async () => {
    const user = setup();
    const { container } = render(PsDateInput, { required: true, value: '' });
    const input = container.querySelector('input[type="date"]');
    
    // Trigger validation error
    expect(input).toBeInTheDocument();
    if (input) {
      await user.click(input);
      await user.tab();
    }
    
    // Wait for error to appear
    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(input).toHaveClass('invalid');
    });
    
    // Enter a valid date
    expect(input).toBeInTheDocument(); // Check input exists before clear
    if (input) {
      await user.clear(input);
      // The fireEvent check already exists below
      fireEvent.input(input, { target: { value: '2023-11-15' } });
      await user.tab();
    }
    
    // Wait for error to disappear
    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).not.toBeInTheDocument();
      expect(input).not.toHaveClass('invalid');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });

  it('applies the name attribute to the input', () => {
    const { container } = render(PsDateInput, { name: 'my-date-field' });
    const input = container.querySelector('input[type="date"]');
    expect(input).toHaveAttribute('name', 'my-date-field');
  });

  it('applies the required attribute to the input when required prop is true', () => {
    const { container } = render(PsDateInput, { required: true });
    const input = container.querySelector('input[type="date"]');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('does not apply the required attribute to the input when required prop is false', () => {
    const { container } = render(PsDateInput, { required: false });
    const input = container.querySelector('input[type="date"]');
    expect(input).not.toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-required', 'false');
  });

  it('has an input container for accessibility and styling', () => {
    const { container } = render(PsDateInput);
    const inputContainer = container.querySelector('.date-input-container');
    expect(inputContainer).toBeInTheDocument();
    expect(inputContainer).toContainElement(container.querySelector('input[type="date"]'));
  });

  it('adds error role="alert" for screen readers when validation fails', async () => {
    const user = setup();
    const { container } = render(PsDateInput, { required: true, value: '' });
    const input = container.querySelector('input[type="date"]');
    
    // Trigger validation
    if (!input) throw new Error('Input not found');
    await user.click(input);
    await user.tab();
    
    // Check for role="alert" on the error message for accessibility
    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });
  });

  it('handles manual direct input', async () => {
    const user = setup();
    const { container } = render(PsDateInput);
    const input = container.querySelector('input[type="date"]');
    
    // Test direct input 
    if (!input) throw new Error('Input not found');
    await user.click(input);
    if (!input) throw new Error('Input not found');
    await user.clear(input);
    if (!input) throw new Error('Input not found');
    await user.type(input, '2023-07-15');
    
    expect(input).toHaveValue('2023-07-15');
  });

  // formatDateForDisplay tests
  it('handles invalid date format in readonly mode', () => {
    const { container } = render(PsDateInput, { 
      readonly: true, 
      value: 'invalid-date' 
    });
    const readonlyDiv = container.querySelector('.readonly-field');
    expect(readonlyDiv).toBeInTheDocument();
    expect(readonlyDiv).toHaveTextContent('');
  });

  it('formats valid date correctly in readonly mode', () => {
    const { container } = render(PsDateInput, { 
      readonly: true, 
      value: '2023-10-26' 
    });
    const readonlyDiv = container.querySelector('.readonly-field');
    expect(readonlyDiv).toBeInTheDocument();
    expect(readonlyDiv).toHaveTextContent('10/26/2023');
  });

  it('handles empty date in readonly mode', () => {
    const { container } = render(PsDateInput, { 
      readonly: true, 
      value: '' 
    });
    const readonlyDiv = container.querySelector('.readonly-field');
    expect(readonlyDiv).toBeInTheDocument();
    expect(readonlyDiv).toHaveTextContent('');
  });

  it('handles edge dates correctly in readonly mode', () => {
    const { container } = render(PsDateInput, { 
      readonly: true, 
      value: '2020-02-29' 
    });
    const readonlyDiv = container.querySelector('.readonly-field');
    expect(readonlyDiv).toBeInTheDocument();
    expect(readonlyDiv).toHaveTextContent('02/29/2020');
  });

  it('handles invalid month/day combinations in readonly mode', () => {
    const { container } = render(PsDateInput, { 
      readonly: true, 
      value: '2023-02-30' 
    });

  // validateDate function tests
  it('validates correct date format', async () => {
    const { container } = render(PsDateInput, { value: '2023-10-26' });
    const input = container.querySelector('input[type="date"]');
    if (!input) throw new Error('Input not found');
    
    await userEvent.click(input);
    await userEvent.tab();
    
    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  it('shows error for invalid month/day combination', async () => {
    const { container } = render(PsDateInput, { value: '2023-02-30' });
    const input = container.querySelector('input[type="date"]');
    if (!input) throw new Error('Input not found');
    
    await userEvent.click(input);
    await userEvent.tab();
    
    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Invalid date entered');
    });
  });

  it('shows error for invalid date format', async () => {
    const { container } = render(PsDateInput, { value: 'invalid-date' });
    const input = container.querySelector('input[type="date"]');
    if (!input) throw new Error('Input not found');
    
    await userEvent.click(input);
    await userEvent.tab();
    
    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Invalid date format stored');
    });
  });

  it('shows error for required empty field after touch', async () => {
    const { container } = render(PsDateInput, { required: true, value: '' });
    const input = container.querySelector('input[type="date"]');
    if (!input) throw new Error('Input not found');
    
    await userEvent.click(input);
    await userEvent.tab();
    
    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Date is required');
    });
  });
    const readonlyDiv = container.querySelector('.readonly-field');
    expect(readonlyDiv).toBeInTheDocument();
    expect(readonlyDiv).toHaveTextContent('');
  });
});
