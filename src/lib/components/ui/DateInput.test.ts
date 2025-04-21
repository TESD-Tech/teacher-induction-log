import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/svelte'; // Import waitFor
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import PsDateInput from './DateInput.svelte'; // Adjust the import path as needed

// Note: This test file uses standard Svelte component testing practices with
// Testing Library and Vitest, which are compatible with Svelte 5 components
// using export let props and reactive statements like the one provided.
// Testing runes requires interacting with the component's public API (props, events)
// and observing its DOM output, which Testing Library facilitates.

describe('PsDateInput', () => {
  // Helper to set up userEvent correctly for each test
  const setup = () => {
    const user = userEvent.setup();
    return user;
  };

  it('renders an input of type date by default', () => {
    render(PsDateInput);
    const input = screen.getByTestId('date-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'date');
  });

  it('renders the readonly field when readonly prop is true', () => {
    render(PsDateInput, { props: { readonly: true, value: '2023-10-26' } });
    const readonlyDiv = screen.getByText('10/26/2023');
    expect(readonlyDiv).toBeInTheDocument();
    const input = screen.queryByTestId('date-input');
    expect(input).not.toBeInTheDocument();
  });

  it('formats the date correctly for display in readonly mode', () => {
    render(PsDateInput, { props: { readonly: true, value: '2024-01-15' } });
    const readonlyDiv = screen.getByText('01/15/2024');
    expect(readonlyDiv).toBeInTheDocument();
  });

  // FIX APPLIED HERE - Now finds the div by data-testid
  it('displays empty string in readonly mode for invalid or empty dates', () => {
    const { rerender } = render(PsDateInput, { props: { readonly: true, value: 'invalid-date' } });
    // In readonly mode, invalid/unparsable dates should result in empty display
    // Use getByTestId as the readonly div should be rendered when readonly is true
    const readonlyDiv = screen.getByTestId('readonly-field');
    expect(readonlyDiv).toBeInTheDocument(); // Ensure the div is rendered
    expect(readonlyDiv).toHaveTextContent(''); // Check its content

    rerender({ props: { readonly: true, value: '' } });
     // The same readonly div should still be present and its content updated (to empty string)
    expect(readonlyDiv).toBeInTheDocument();
    expect(readonlyDiv).toHaveTextContent('');
  });


  it('binds the value prop to the input', async () => {
    const user = setup();
    render(PsDateInput);
    const input = screen.getByTestId('date-input') as HTMLInputElement;

    await user.type(input, '2023-11-01');
    expect(input.value).toBe('2023-11-01');
  });

  it('updates the value prop when input changes', async () => {
    const user = setup();
    const initialValue = '2023-12-25';
    render(PsDateInput, { props: { value: initialValue } });
    const input = screen.getByTestId('date-input') as HTMLInputElement;

    expect(input).toHaveValue(initialValue);

    const newValue = '2024-01-01';
    await user.clear(input);
    await user.type(input, newValue);
    expect(input).toHaveValue(newValue);
  });


  it('does not show error message initially if not required and value is empty', () => {
    render(PsDateInput, { props: { required: false, value: '' } });
    const errorMessage = screen.queryByRole('alert');
    expect(errorMessage).not.toBeInTheDocument();
    const input = screen.getByTestId('date-input');
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not show error message initially if value is valid', () => {
    render(PsDateInput, { props: { value: '2023-10-26' } });
    const errorMessage = screen.queryByRole('alert');
    expect(errorMessage).not.toBeInTheDocument();
    const input = screen.getByTestId('date-input');
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('shows error message and invalid class on blur if required and value is empty', async () => {
    const user = setup();
    render(PsDateInput, { props: { required: true, value: '' } });
    const input = screen.getByTestId('date-input');

    await user.click(input); // Focus
    await user.tab(); // Blur - This sets touched=true and triggers validation/display

    // Use findBy* to wait for the error message to appear
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Date is required');
    expect(input).toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  // FIX APPLIED HERE - Render with invalid value initially, then blur
  it('shows error message and invalid class on blur when value is initially invalid format (set by prop)', async () => {
    const user = setup();
    // Render with an invalid value directly via props
    render(PsDateInput, { props: { value: 'invalid-format' } });
    const input = screen.getByTestId('date-input') as HTMLInputElement;

    // Blur the input to trigger the touched state and validation display
    await user.click(input); // Focus
    await user.tab(); // Blur

    // Use findBy* to wait for the error message to appear
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Invalid date format stored'); // Assuming this specific error message is intended
    expect(input).toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  // FIX APPLIED HERE - Render with invalid value initially, then blur
  it('shows error message and invalid class on blur when value is initially an invalid date (set by prop)', async () => {
    const user = setup();
    // Render with an invalid date value directly via props
    render(PsDateInput, { props: { value: '2023-04-31' } }); // April has 30 days
    const input = screen.getByTestId('date-input') as HTMLInputElement;

    // Blur the input to trigger the touched state and validation display
    await user.click(input); // Focus
    await user.tab(); // Blur

    // Use findBy* to wait for the error message to appear
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Invalid date entered');
    expect(input).toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });


  it('clears error message and invalid class when a valid date is entered after an invalid one', async () => {
    const user = setup();
    render(PsDateInput, { props: { required: true } }); // Start required to easily trigger error
    const input = screen.getByTestId('date-input') as HTMLInputElement;

    // Trigger validation error by blurring empty required field
    await user.click(input);
    await user.tab();
    // Use getBy* as the element should be present after blur and before clearing
    let errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(input).toHaveClass('invalid');

    // Enter a valid date and blur
    await user.clear(input);
    fireEvent.input(input, { target: { value: '2023-11-15' } }); // Manually set value
    await user.tab(); // Blur - should trigger validation pass and clear error

    // Use waitFor with not.toBeInTheDocument to wait for the element to be removed
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());

    // Now assert that the error message is gone and validation state is correct
    expect(screen.queryByRole('alert')).not.toBeInTheDocument(); // Redundant but harmless check after waitFor
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('applies the name attribute to the input', () => {
    render(PsDateInput, { props: { name: 'my-date-field' } });
    const input = screen.getByTestId('date-input');
    expect(input).toHaveAttribute('name', 'my-date-field');
  });

  it('applies the required attribute to the input when required prop is true', () => {
    render(PsDateInput, { props: { required: true } });
    const input = screen.getByTestId('date-input');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('does not apply the required attribute to the input when required prop is false', () => {
    render(PsDateInput, { props: { required: false } });
    const input = screen.getByTestId('date-input');
    expect(input).not.toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-required', 'false');
  });

  it('validates and shows error message when required prop changes to true for empty field AND then is touched', async () => {
    const user = setup();
    const { rerender } = render(PsDateInput, { props: { required: false, value: '' } });
    const input = screen.getByTestId('date-input');

    // No validation errors initially (not required, empty, not touched)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');

    // Rerender with required true - Validation logic runs via $effect,
    // but error message is NOT yet displayed because touched is false.
    rerender({ props: { required: true, value: '' } });

    // Assert error message is still NOT visible immediately after rerender
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveClass('invalid'); // The class isn't applied until touched either

    // Trigger touched state by blurring the input - This will make the error message visible
    await user.click(input); // Focus
    await user.tab(); // Blur

    // Wait for the error message to appear in the DOM and then assert
    const errorMessage = await screen.findByRole('alert'); // Use findBy* to wait
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Date is required');
    expect(input).toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('validates when value changes externally after being touched', async () => {
    const user = setup();
    // Start with required true and empty value to easily trigger touched + invalid state
    const { rerender } = render(PsDateInput, { props: { required: true, value: '' } });
    const input = screen.getByTestId('date-input') as HTMLInputElement;

    // Trigger touched state and initial validation error
    await user.click(input); // Focus
    await user.tab(); // Blur
    // Wait for the error message to appear
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument(); // Ensure error is shown
    expect(input).toHaveClass('invalid');

    // Rerender with a valid value set externally
    rerender({ props: { required: true, value: '2024-05-20' } });

    // Use waitFor with not.toBeInTheDocument to wait for the element to be removed
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());

    // Now assert that the error message is gone and validation state is correct
    expect(screen.queryByRole('alert')).not.toBeInTheDocument(); // Redundant but harmless check after waitFor
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not validate initially if not required and value is empty, even if touched', async () => {
    const user = setup();
    render(PsDateInput, { props: { required: false, value: '' } });
    const input = screen.getByTestId('date-input');

    // Trigger touched state by blurring an empty non-required field
    await user.click(input);
    await user.tab();

    // No validation errors should appear
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });
});