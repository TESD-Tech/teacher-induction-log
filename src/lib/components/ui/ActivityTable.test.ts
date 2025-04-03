import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ActivityTable from './ActivityTable.svelte';

describe('ActivityTable Component', () => {
  it('renders with the provided headers', () => {
    const headers = ['Column 1', 'Column 2', 'Column 3'];
    render(ActivityTable, { 
      props: { headers, showActions: true } 
    });
    
    // Check that each header is in the document
    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });

    // Check that the actions column exists
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
  
  it('does not render actions column when showActions is false', () => {
    const headers = ['Column 1', 'Column 2', 'Column 3'];
    render(ActivityTable, { 
      props: { headers, showActions: false } 
    });
    
    // Check that each header is in the document
    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });

    // Check that the actions column does not exist
    expect(screen.queryByText('Actions')).toBeNull();
  });
  
  it('applies column widths correctly', () => {
    const headers = ['Column 1', 'Column 2', 'Column 3'];
    const columnWidths = ['20%', '30%', '50%'];
    
    const { container } = render(ActivityTable, { 
      props: { headers, columnWidths, showActions: false } 
    });
    
    const headerElements = container.querySelectorAll('th');
    
    columnWidths.forEach((width, index) => {
      expect(headerElements[index].style.width).toBe(width);
    });
  });
  
  it('renders a table with a tbody element', () => {
    const headers = ['Column 1', 'Column 2'];
    render(ActivityTable, { 
      props: { headers, showActions: false }
    });
    
    // Verify that there's a table element
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    // Verify that table has a tbody
    const tbody = table.querySelector('tbody');
    expect(tbody).toBeTruthy();
  });
  
  it('has the correct table structure', () => {
    const headers = ['Column 1', 'Column 2'];
    const { container } = render(ActivityTable, { 
      props: { headers, showActions: true } 
    });
    
    // In Svelte 5, the class name is automatically generated
    // So we verify the table is contained within a div with table-container class
    const tableContainer = container.querySelector('.table-container');
    expect(tableContainer).toBeTruthy();
    
    const table = screen.getByRole('table');
    
    // Verify table has thead and tbody
    const thead = table.querySelector('thead');
    expect(thead).toBeTruthy();
    
    const tbody = table.querySelector('tbody');
    expect(tbody).toBeTruthy();
    
    // Verify header row structure
    const headerRow = thead.querySelector('tr');
    expect(headerRow).toBeTruthy();
    
    // With 2 headers + actions, there should be 3 th elements
    const headerCells = headerRow.querySelectorAll('th');
    expect(headerCells.length).toBe(3);
  });
  
  it('styles the actions column correctly', () => {
    const headers = ['Column 1', 'Column 2'];
    const { container } = render(ActivityTable, { 
      props: { headers, showActions: true } 
    });
    
    // The last header should be the actions column
    const headerCells = container.querySelectorAll('th');
    const actionsHeader = headerCells[headerCells.length - 1]; 
    
    expect(actionsHeader).toHaveClass('actions-column');
    expect(actionsHeader.textContent).toBe('Actions');
  });
});