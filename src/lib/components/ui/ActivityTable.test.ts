import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ActivityTable from './ActivityTable.svelte';

describe('ActivityTable Component', () => {
  
  
  it('applies column widths correctly', () => {
    const headers = ['Column 1', 'Column 2', 'Column 3'];
    const columnWidths = ['20%', '30%', '50%'];
    
    const { container } = render(ActivityTable, { 
      props: { headers, columnWidths }
    });
    
    const headerElements = container.querySelectorAll('th');
    
    columnWidths.forEach((width, index) => {
      expect(headerElements[index].style.width).toBe(width);
    });
  });
  
  it('renders a table with a tbody element', () => {
    const headers = ['Column 1', 'Column 2'];
    render(ActivityTable, { 
      props: { headers }
    });
    
    // Verify that there's a table element
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    // Verify that table has a tbody
    const tbody = table.querySelector('tbody');
    expect(tbody).toBeTruthy();
  });
  
  
});