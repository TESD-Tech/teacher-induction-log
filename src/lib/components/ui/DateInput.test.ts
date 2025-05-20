import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import PsDateInput from './DateInput.svelte';

describe('PsDateInput', () => {
  // Helper to set up userEvent correctly for each test
  const setup = () => {
    // userEvent.setup() is recommended for better event simulation
    return userEvent.setup();
  };

  // Basic rendering tests
  it('renders an input of type date by default', () => {
    const { container } = render(PsDateInput);
    const input = container.querySelector('input[type="date"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'date');
  });

  // Readonly mode tests
  it('renders the readonly field with formatted date when readonly prop is true and value is valid', () => {
    const { container } = render(PsDateInput, { readonly: true, value: '2023-10-26' });
    const readonlyDiv = container.querySelector('.readonly-field');
    expect(readonlyDiv).toBeInTheDocument();
    // Ensure the formatted text matches the expected MM/DD/YYYY format
    expect(readonlyDiv).toHaveTextContent('10/26/2023');

    // Input should not be present in readonly mode
    const input = container.querySelector('input[type="date"]');
    expect(input).not.toBeInTheDocument();
  });

  it('renders the readonly field with empty text when readonly prop is true and value is invalid or empty', () => {
    const { container } = render(PsDateInput, { readonly: true, value: 'invalid-date' });
    const readonlyDiv = container.querySelector('.readonly-field');
    expect(readonlyDiv).toBeInTheDocument();
    expect(readonlyDiv).toHaveTextContent('');

    const { container: container2 } = render(PsDateInput, { readonly: true, value: '' });
    const readonlyDiv2 = container2.querySelector('.readonly-field');
    expect(readonlyDiv2).toBeInTheDocument();
    expect(readonlyDiv2).toHaveTextContent('');
  });

  // Binding and value updating tests
  // In Svelte 5 with @testing-library/svelte, you re-render with new props
  // or use the `component` object's methods if available (though re-render is common).
  // Let's test this by re-rendering.
  it('updates the input value when the value prop changes externally', async () => {
    const { container, rerender } = render(PsDateInput, { value: '2023-12-25' });
    const input = container.querySelector('input[type="date"]');

    expect(input).toHaveValue('2023-12-25');

    // Update the prop externally by re-rendering
    await rerender({ value: '2024-01-01' });

    expect(input).toHaveValue('2024-01-01');
  });

  // Testing user input and its effect on the input element's value attribute.
  it('updates the input element\'s value when user types', async () => {
    const user = setup();
    const { container } = render(PsDateInput);
    const input = container.querySelector('input[type="date"]');

    if (!input) throw new Error('Input not found');

    // Using type will simulate keyboard input, which should update the element's value
    await user.type(input, '2023-11-05');

    expect(input).toHaveValue('2023-11-05');
  });


  // Error state and validation tests
  it('does not show error message initially if not required and value is empty', () => {
    const { container } = render(PsDateInput, { required: false, value: '' });
    const errorMessage = container.querySelector('.error-message');
    expect(errorMessage).not.toBeInTheDocument();

    const input = container.querySelector('input[type="date"]');
    // Check the presence and value of aria-invalid directly on the input
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not show error message initially if value is valid', () => {
    const { container } = render(PsDateInput, { value: '2023-10-26' });
    const errorMessage = container.querySelector('.error-message');
    expect(errorMessage).not.toBeInTheDocument();

    const input = container.querySelector('input[type="date"]');
     // Check the presence and value of aria-invalid directly on the input
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('shows error message and invalid class on blur if required and value is empty', async () => {
    const user = setup();
    const { container } = render(PsDateInput, { required: true, value: '' });
    const input = container.querySelector('input[type="date"]');

    expect(input).toBeInTheDocument();
    if (!input) throw new Error('Input not found');

    // Focus and blur to trigger validation on touch and blur
    await user.click(input); // This also triggers touch
    await user.tab(); // Blurs the input

    // Wait for validation to complete and error message to appear
    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Date is required'); // Assuming this is the required message
      expect(input).toHaveClass('invalid');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('clears error message when a valid date is entered after being required and showing error', async () => {
    const user = setup();
    const { container } = render(PsDateInput, { required: true, value: '' });
    const input = container.querySelector('input[type="date"]');

    expect(input).toBeInTheDocument();
    if (!input) throw new Error('Input not found');

    // Trigger validation error by touching and blurring
    await user.click(input);
    await user.tab();

    // Wait for error to appear
    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(input).toHaveClass('invalid');
    });

    // Enter a valid date using userEvent
    await user.clear(input); // Clear existing value if any
    await user.type(input, '2023-11-15');
    await user.tab(); // Blur again to trigger re-validation

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

    // Trigger validation by touching and blurring
    if (!input) throw new Error('Input not found');
    await user.click(input);
    await user.tab();

    // Check for role="alert" on the error message for accessibility
    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });
  });

  it('handles direct user input and updates the input value', async () => {
    const user = setup();
    const { container } = render(PsDateInput);
    const input = container.querySelector('input[type="date"]');

    if (!input) throw new Error('Input not found');

    // Clear and type to simulate user entering a value
    await user.clear(input);
    await user.type(input, '2023-07-15');

    // Expect the input element's value attribute to be updated
    expect(input).toHaveValue('2023-07-15');
  });


  it('validates correct date format on blur', async () => {
    const user = setup();
    const { container } = render(PsDateInput, { value: '2023-10-26' });
    const input = container.querySelector('input[type="date"]');
    if (!input) throw new Error('Input not found');

    // Blur the input to trigger validation
    await user.click(input);
    await user.tab();

    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).not.toBeInTheDocument();
      expect(input).not.toHaveClass('invalid');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });

  it('shows error for invalid month/day combination on blur', async () => {
    const user = setup();
    const { container } = render(PsDateInput, { value: '2023-02-30' });
    const input = container.querySelector('input[type="date"]');
    if (!input) throw new Error('Input not found');

    // Blur the input to trigger validation
    await user.click(input);
    await user.tab();

    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeInTheDocument();
      // Assuming the component provides a specific message for this type of invalidity
      expect(errorMessage).toHaveTextContent('Invalid date entered');
      expect(input).toHaveClass('invalid');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('shows error for invalid date format on blur', async () => {
    const user = setup();
    const { container } = render(PsDateInput, { value: 'invalid-date' });
    const input = container.querySelector('input[type="date"]');
    if (!input) throw new Error('Input not found');

    // Blur the input to trigger validation
    await user.click(input);
    await user.tab();

    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeInTheDocument();
      // Assuming the component provides a specific message for invalid format
      expect(errorMessage).toHaveTextContent('Invalid date format stored');
      expect(input).toHaveClass('invalid');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('shows error for required empty field after touch and blur', async () => {
    const user = setup();
    const { container } = render(PsDateInput, { required: true, value: '' });
    const input = container.querySelector('input[type="date"]');
    if (!input) throw new Error('Input not found');

    // Click (touches) and then blur to trigger validation
    await user.click(input);
    await user.tab();

    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Date is required');
      expect(input).toHaveClass('invalid');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('shows error for required empty field after touch and blur, and keeps showing required error if next input is invalid', async () => {
    const user = setup();
    const { container } = render(PsDateInput, { required: true, value: '' });
    const input = container.querySelector('input[type="date"]');
    if (!input) throw new Error('Input not found');

    // Trigger initial required error by touching and blurring
    await user.click(input);
    await user.tab();

    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Date is required');
      expect(input).toHaveClass('invalid');
    });

    // Enter a syntactically invalid date (like 2023-02-30) and blur
    await user.clear(input);
    await user.type(input, '2023-02-30');
    await user.tab();

    // Still expect the required error, as this is the preferred UX
    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Date is required');
      expect(input).toHaveClass('invalid');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  // Effect validation tests (refined based on how validation is likely triggered)
  it('does not show error for empty field when not required and not touched/blurred', async () => {
    const { container } = render(PsDateInput, { required: false, value: '' });

    // No interaction, so no validation or error should be visible
    const errorMessage = container.querySelector('.error-message');
    expect(errorMessage).not.toBeInTheDocument();

    const input = container.querySelector('input[type="date"]');
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });
});