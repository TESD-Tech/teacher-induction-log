import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import DateInput from './DateInput.svelte';

describe('DateInput Component', () => {
  const originalDate = global.Date;

  beforeEach(() => {
    // Mock Date to have a consistent "now" for testing
    global.Date = class extends Date {
      constructor(...args) {
        args.length === 0 ? super('2024-04-03') : super(...args);
      }
      static now() {
        return new Date('2024-04-03').getTime();
      }
    } as any;
  });

  afterEach(() => {
    // Restore original Date
    global.Date = originalDate;
  });

  it('renders an input field when not readonly', () => {
    const { container } = render(DateInput, { 
      props: { 
        value: '',
        readonly: false
      }
    });
    
    const input = container.querySelector('input[type="date"]');
    expect(input).toBeTruthy();
  });

  it('renders a readonly div when readonly is true', () => {
    const { container } = render(DateInput, { 
      props: { 
        value: '01/15/2024',
        readonly: true
      }
    });
    
    const input = container.querySelector('input');
    expect(input).toBeFalsy();
    
    const readonlyDiv = container.querySelector('.readonly-field');
    expect(readonlyDiv).toBeTruthy();
    expect(readonlyDiv.textContent).toBe('01/15/2024');
  });

  it('validates future dates', async () => {
    const futureDate = '04/05/2024'; // A date after the mocked current date

    const { container } = render(DateInput, { 
      props: { 
        value: futureDate,
        readonly: false,
        required: true
      }
    });

    // Trigger blur to validate
    const input = container.querySelector('input[type="date"]');
    await fireEvent.blur(input);

    const errorMessage = container.querySelector('.error-message');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toBe('Date cannot be in the future');
  });

  it('handles invalid date formats', async () => {
    const invalidDates = [
      '13/32/2023',   // Invalid month and day
      '02/30/2023',   // Invalid day for February
      '2023/13/01',   // Invalid format
      'not a date'    // Completely invalid string
    ];

    for (const dateString of invalidDates) {
      const { container } = render(DateInput, { 
        props: { 
          value: dateString,
          readonly: false,
          required: true
        }
      });

      // Trigger blur to validate
      const input = container.querySelector('input[type="date"]');
      await fireEvent.blur(input);

      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent).toBe('Please enter a valid date (MM/DD/YYYY)');
    }
  });

  it('handles required field validation', async () => {
    const { container } = render(DateInput, { 
      props: { 
        value: '',
        readonly: false,
        required: true
      }
    });

    // Trigger blur to validate
    const input = container.querySelector('input[type="date"]');
    await fireEvent.blur(input);

    const errorMessage = container.querySelector('.error-message');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toBe('Date is required');
  });

  it('allows empty values when not required', async () => {
    const { container } = render(DateInput, { 
      props: { 
        value: '',
        readonly: false,
        required: false
      }
    });

    // Trigger blur to validate
    const input = container.querySelector('input[type="date"]');
    await fireEvent.blur(input);

    const errorMessage = container.querySelector('.error-message');
    expect(errorMessage).toBeFalsy();
  });

  it('converts between display and input date formats', () => {
    const testCases = [
      { display: '01/15/2024', input: '2024-01-15' },
      { display: '1/5/2024', input: '2024-01-05' },
      { display: '12/31/2023', input: '2023-12-31' }
    ];

    testCases.forEach(({ display, input }) => {
      const { container } = render(DateInput, { 
        props: { 
          value: display,
          readonly: false
        }
      });

      const dateInput = container.querySelector('input[type="date"]');
      expect(dateInput.value).toBe(input);
    });
  });

  it('handles accessibility attributes', () => {
    const { container } = render(DateInput, { 
      props: { 
        value: '01/15/2024',
        readonly: false,
        name: 'test-date',
        required: true
      }
    });

    const input = container.querySelector('input[type="date"]');
    
    expect(input).toHaveAttribute('name', 'test-date');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('type', 'date');
  });

  it('applies visual validation states', async () => {
    const { container, component, rerender } = render(DateInput, { 
      props: { 
        value: '',
        readonly: false,
        required: true
      }
    });

    const input = container.querySelector('input[type="date"]');
    
    // Trigger validation by simulating blur
    await fireEvent.blur(input);
    
    // Re-render to update the component state
    await rerender({ 
      value: '',
      readonly: false,
      required: true
    });

    // Check invalid class and error message
    expect(input.classList.contains('invalid')).toBe(true);
    const errorMessage = container.querySelector('.error-message');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toBe('Date is required');

    // Update to a valid date and re-render
    await rerender({ 
      value: '01/15/2024',
      readonly: false,
      required: true
    });

    // Trigger validation again
    await fireEvent.blur(input);
    
    // Check that invalid class is removed
    expect(input.classList.contains('invalid')).toBe(false);
    expect(container.querySelector('.error-message')).toBeFalsy();
  });
});