import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ActionsBar from './ActionsBar.svelte';
import * as formStore from '../../stores/formStore';

describe('ActionsBar Component', () => {
  beforeEach(() => {
    // Mock the form store functions
    vi.spyOn(formStore, 'printForm').mockImplementation(() => {});
    vi.spyOn(formStore, 'saveForm').mockImplementation(() => {});
  });

  it('renders print and save buttons', () => {
    const { getAllByText } = render(ActionsBar);
    
    // Check for buttons with text
    expect(getAllByText(/Print Form/i)[0]).toBeTruthy();
    expect(getAllByText(/Save Form/i)[0]).toBeTruthy();
  });

  it('renders Carbon icons inside the buttons', () => {
    const { container } = render(ActionsBar);
    
    // Check for icon spans
    const iconSpans = container.querySelectorAll('.icon');
    expect(iconSpans.length).toBe(2);
    
    // Check that each span contains an SVG
    iconSpans.forEach(span => {
      expect(span.querySelector('svg')).toBeTruthy();
    });
  });

  it('calls printForm when print button is clicked', async () => {
    const { getByText } = render(ActionsBar);
    
    // Find and click the Print Form button
    const printButton = getByText(/Print Form/i);
    await fireEvent.click(printButton);
    
    // Check that printForm was called
    expect(formStore.printForm).toHaveBeenCalledTimes(1);
  });

  it('calls saveForm when save button is clicked', async () => {
    const { getByText } = render(ActionsBar);
    
    // Find and click the Save Form button
    const saveButton = getByText(/Save Form/i);
    await fireEvent.click(saveButton);
    
    // Check that saveForm was called
    expect(formStore.saveForm).toHaveBeenCalledTimes(1);
  });

  it('has the correct structural elements', () => {
    const { container } = render(ActionsBar);
    
    // Check for the header toolbar container
    const toolbarDiv = container.querySelector('.header-toolbar');
    expect(toolbarDiv).toBeTruthy();
    
    // Check for button elements
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('contains the correct CSS classes for styling', () => {
    const { container } = render(ActionsBar);
    
    // Check that the toolbar container has the correct class
    const toolbarDiv = container.querySelector('.header-toolbar');
    expect(toolbarDiv).toHaveClass('header-toolbar');
    
    // Check for toolbar content container
    const toolbarContent = container.querySelector('.toolbar-content');
    expect(toolbarContent).toBeTruthy();
    
    // Check for district title
    const districtTitle = container.querySelector('.district-title');
    expect(districtTitle).toBeTruthy();
    
    // Check icon classes
    const iconSpans = container.querySelectorAll('.icon');
    iconSpans.forEach(span => {
      expect(span).toHaveClass('icon');
    });
  });
});
// Additional tests for error handling and storage events
import * as formStore from '../../stores/formStore';
import { render, fireEvent } from '@testing-library/svelte';
import ActionsBar from './ActionsBar.svelte';

describe('ActionsBar Edge Cases', () => {
  it('shows error notification if saveForm throws', async () => {
    vi.spyOn(formStore, 'saveForm').mockImplementation(() => { throw new Error('Save failed'); });
    const { getByText, findByText } = render(ActionsBar);

    const saveButton = getByText(/Save Form/i);
    await fireEvent.click(saveButton);

    const errorNotification = await findByText(/Failed to save form/i);
    expect(errorNotification).toBeTruthy();
  });

  it('shows auto-save notification on storage event', async () => {
    const { findByText } = render(ActionsBar);

    const event = new StorageEvent('storage', {
      key: 'teacher-induction-log-data',
      newValue: 'some data'
    });
    window.dispatchEvent(event);

    const autoSaveNotification = await findByText(/Form data auto-saved/i);
    expect(autoSaveNotification).toBeTruthy();
  });
});
