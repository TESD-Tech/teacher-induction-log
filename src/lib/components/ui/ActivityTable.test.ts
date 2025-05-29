import { render, screen } from '@testing-library/svelte';
import { expect, test, describe } from 'vitest';
import ActivityTable from './ActivityTable.svelte';
import ActivityTableTestWrapper from './ActivityTableTestWrapper.svelte';

const headers = ['Date', 'Activity', 'Hours'];
const columnWidths = ['120px', 'auto', '80px'];

describe('ActivityTable.svelte', () => {
	test('renders table headers and column widths', () => {
		render(ActivityTable, { props: { headers, columnWidths } });
		headers.forEach((header, i) => {
			const th = screen.getByText(header);
			expect(th).toBeInTheDocument();
			if (columnWidths[i]) {
				expect(th).toHaveStyle(`width: ${columnWidths[i]}`);
			}
		});
	});

	test('renders all rows and cells via slot', () => {
		const testSlotContent = '<tr><td>Test Date</td><td>Test Activity</td><td>Test Hours</td></tr>';
		render(ActivityTableTestWrapper, { 
			props: { headers, columnWidths, testSlotContent }
		});
		
		// Check that the slot content is rendered
		expect(screen.getByText('Test Date')).toBeInTheDocument();
		expect(screen.getByText('Test Activity')).toBeInTheDocument();
		expect(screen.getByText('Test Hours')).toBeInTheDocument();
	});

	test('renders custom slot content', () => {
		const testSlotContent = '<tr><td><span data-testid="custom-cell">Custom</span></td><td>Content</td><td>Test</td></tr>';
		render(ActivityTableTestWrapper, { 
			props: { headers, columnWidths, testSlotContent }
		});
		
		const customCell = screen.getByTestId('custom-cell');
		expect(customCell).toBeInTheDocument();
		expect(customCell.textContent).toBe('Custom');
	});

	test('applies responsive and print styles (class and container)', () => {
		render(ActivityTable, { props: { headers, columnWidths } });
		const table = screen.getByRole('table');
		expect(table.className).toMatch(/activity-table/);
		const container = table.closest('.table-container');
		expect(container).toBeInTheDocument();
	});

	test('renders empty state if no slot content', () => {
		render(ActivityTable, { props: { headers: [], columnWidths: [], emptyMessage: 'No activities!' } });
		expect(screen.getByText('No activities!')).toBeInTheDocument();
	});
});
