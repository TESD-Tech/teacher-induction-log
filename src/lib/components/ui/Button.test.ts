import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import PsDateInput from './DateInput.svelte'; // Adjust the import path as needed

describe('PsDateInput', () => {
  const setup = () => {
    const user = userEvent.setup();
    return user;
  };

  // Restore original window.confirm after each test
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders an input of type date by default', () => {
    render(PsDateInput);
    const input = screen.getByTestId('date-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'date');
  });

  it('renders the readonly field when readonly prop is true', () => {
    render(PsDateInput, { readonly: true, value: '2023-10-26' }); // Updated syntax
    const readonlyDiv = screen.getByText('10/26/2023');
    expect(readonlyDiv).toBeInTheDocument();
    const input = screen.queryByTestId('date-input');
    expect(input).not.toBeInTheDocument();
  });

  it('formats the date correctly for display in readonly mode', () => {
    render(PsDateInput, { readonly: true, value: '2024-01-15' }); // Updated syntax
    const readonlyDiv = screen.getByText('01/15/2024');
    expect(readonlyDiv).toBeInTheDocument();
  });

  it('displays empty string in readonly mode for invalid or empty dates', () => {
    // Assuming data-testid="readonly-field" is added to the component's readonly div
    const { rerender } = render(PsDateInput, { readonly: true, value: 'invalid-date' }); // Updated syntax
    const readonlyDiv = screen.getByTestId('readonly-field');
    expect(readonlyDiv).toBeInTheDocument();
    expect(readonlyDiv).toHaveTextContent('');

    rerender({ readonly: true, value: '' }); // Updated syntax
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
    render(PsDateInput, { value: initialValue }); // Updated syntax
    const input = screen.getByTestId('date-input') as HTMLInputElement;

    expect(input).toHaveValue(initialValue);

    const newValue = '2024-01-01';
    await user.clear(input);
    await user.type(input, newValue);
    expect(input).toHaveValue(newValue);
  });

  it('does not show error message initially if not required and value is empty', () => {
    render(PsDateInput, { required: false, value: '' }); // Updated syntax
    const errorMessage = screen.queryByRole('alert');
    expect(errorMessage).not.toBeInTheDocument();
    const input = screen.getByTestId('date-input');
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not show error message initially if value is valid', () => {
    render(PsDateInput, { value: '2023-10-26' }); // Updated syntax
    const errorMessage = screen.queryByRole('alert');
    expect(errorMessage).not.toBeInTheDocument();
    const input = screen.getByTestId('date-input');
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('shows error message and invalid class on blur if required and value is empty', async () => {
    const user = setup();
    render(PsDateInput, { required: true, value: '' }); // Updated syntax
    const input = screen.getByTestId('date-input');

    await user.click(input); // Focus
    await user.tab(); // Blur

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Date is required');
    expect(input).toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error message and invalid class on blur if value has invalid format (manual value set)', async () => {
    const user = setup();
    render(PsDateInput);
    const input = screen.getByTestId('date-input') as HTMLInputElement;

    fireEvent.input(input, { target: { value: 'invalid-format' } });
    await user.tab(); // Blur

    const errorMessage = await screen.findByRole('alert', {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Invalid date format stored');
    expect(input).toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error message and invalid class on blur if value is an invalid date (manual value set)', async () => {
    const user = setup();
    render(PsDateInput);
    const input = screen.getByTestId('date-input') as HTMLInputElement;

    fireEvent.input(input, { target: { value: '2023-04-31' } });
    await user.tab(); // Blur

    const errorMessage = await screen.findByRole('alert', {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Invalid date entered');
    expect(input).toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('clears error message and invalid class when a valid date is entered after an invalid one', async () => {
    const user = setup();
    render(PsDateInput, { required: true }); // Updated syntax
    const input = screen.getByTestId('date-input') as HTMLInputElement;

    await user.click(input);
    await user.tab();
    let errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(input).toHaveClass('invalid');

    await user.clear(input);
    fireEvent.input(input, { target: { value: '2023-11-15' } });
    await user.tab();

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('applies the name attribute to the input', () => {
    render(PsDateInput, { name: 'my-date-field' }); // Updated syntax
    const input = screen.getByTestId('date-input');
    expect(input).toHaveAttribute('name', 'my-date-field');
  });

  it('applies the required attribute to the input when required prop is true', () => {
    render(PsDateInput, { required: true }); // Updated syntax
    const input = screen.getByTestId('date-input');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('does not apply the required attribute to the input when required prop is false', () => {
    render(PsDateInput, { required: false }); // Updated syntax
    const input = screen.getByTestId('date-input');
    expect(input).not.toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-required', 'false');
  });

  it('validates and shows error message when required prop changes to true for empty field AND then is touched', async () => {
    const user = setup();
    const { rerender } = render(PsDateInput, { required: false, value: '' }); // Updated syntax
    const input = screen.getByTestId('date-input');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');

    rerender({ required: true, value: '' }); // Updated syntax

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveClass('invalid');

    await user.click(input);
    await user.tab();

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Date is required');
    expect(input).toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('validates when value changes externally after being touched', async () => {
    const user = setup();
    const { rerender } = render(PsDateInput, { required: true, value: '' }); // Updated syntax
    const input = screen.getByTestId('date-input') as HTMLInputElement;

    await user.click(input);
    await user.tab();
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(input).toHaveClass('invalid');

    rerender({ required: true, value: '2024-05-20' }); // Updated syntax

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not validate initially if not required and value is empty, even if touched', async () => {
    const user = setup();
    render(PsDateInput, { required: false, value: '' }); // Updated syntax
    const input = screen.getByTestId('date-input');

    await user.click(input);
    await user.tab();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveClass('invalid');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });
});