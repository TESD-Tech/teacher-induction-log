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
    
    // Check for the actions container
    const actionsDiv = container.querySelector('.actions');
    expect(actionsDiv).toBeTruthy();
    
    // Check for button elements
    const buttons = actionsDiv.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('contains the correct CSS classes for styling', () => {
    const { container } = render(ActionsBar);
    
    // Check that the actions container has the correct class
    const actionsDiv = container.querySelector('.actions');
    expect(actionsDiv).toHaveClass('actions');
    
    // Check icon classes
    const iconSpans = container.querySelectorAll('.icon');
    iconSpans.forEach(span => {
      expect(span).toHaveClass('icon');
    });
  });
});
