import { render, screen, fireEvent } from '@testing-library/svelte';
import Select from '../lib/components/ui/Select.svelte';

describe('Select Component', () => {
  it('should render with options', () => {
    const options = [{ dcid: '1', name: 'Option 1' }, { dcid: '2', name: 'Option 2' }];
    render(<Select options={options} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should render with a selected value', () => {
    const options = [{ dcid: '1', name: 'Option 1' }, { dcid: '2', name: 'Option 2' }];
    render(<Select options={options} value="1" />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('1');
  });

  it('should render with a historical value', () => {
    const options = [{ dcid: '2', name: 'Option 2' }];
    render(<Select options={options} value="1" />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should render with a value that is not in the options list', () => {
    const options = [{ dcid: '2', name: 'Option 2' }];
    render(<Select options={options} value="1" />);
    expect(screen.getByText('1 (Current ID - Not in list)')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should render with a placeholder', () => {
    render(<Select />);
    expect(screen.getByText('-- Select --')).toBeInTheDocument();
  });

  it('should handle the required attribute', () => {
    render(<Select required />);
    expect(screen.getByRole('combobox')).toHaveAttribute('required');
  });

  it('should handle the aria-label attribute', () => {
    render(<Select ariaLabel="My Select" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-label', 'My Select');
  });
});