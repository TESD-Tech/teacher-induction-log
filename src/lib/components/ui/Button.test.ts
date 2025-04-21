import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import PsButton from './Button.svelte'; // Adjust import path as needed

describe('PsButton', () => {
  const setup = () => {
    const user = userEvent.setup();
    // Mock window.confirm globally for these tests
    const confirmMock = vi.spyOn(window, 'confirm');
    return { user, confirmMock };
  };

  // Restore original window.confirm after each test
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a button with default type and class', () => {
    render(PsButton);
    const button = screen.getByTestId('ps-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button'); // Default type is 'button'
    expect(button).toHaveClass('default'); // Default variant is 'default'
    expect(button).not.toHaveClass('compact'); // Default compact is false
  });

  // FIX APPLIED HERE - Check for text content directly in the document
  it('renders button content from the slot', async () => {
    render(PsButton, { slot: 'Click Me' });
    // Use findByText to wait for the slot content to appear
    const slotContent = await screen.findByText('Click Me');
    expect(slotContent).toBeInTheDocument();
    const button = screen.getByTestId('ps-button');
    // Optionally check that the slot content is indeed inside the button
    expect(button).toContainElement(slotContent);
  });

  // FIX APPLIED HERE - Added await after rerender
  it('applies the correct variant class', async () => { // Made test async
    const { rerender } = render(PsButton, { props: { variant: 'add' } });
    let button = screen.getByTestId('ps-button');
    expect(button).toHaveClass('add');
    expect(button).not.toHaveClass('default');

    rerender({ props: { variant: 'remove' } });
    // Wait for the DOM update after rerender before asserting
    button = await screen.findByTestId('ps-button'); // findBy* waits for element to appear/update
    expect(button).toHaveClass('remove');
    expect(button).not.toHaveClass('add');

    rerender({ props: { variant: 'default' } });
     // Wait for the DOM update after rerender before asserting
    button = await screen.findByTestId('ps-button');
    expect(button).toHaveClass('default');
    expect(button).not.toHaveClass('remove');
  });

  // FIX APPLIED HERE - Added await after rerender
  it('applies the compact class when compact prop is true', async () => { // Made test async
    const { rerender } = render(PsButton, { props: { compact: true } });
    // Wait for the DOM update after initial render (though often not strictly needed here)
    let button = await screen.findByTestId('ps-button');
    expect(button).toHaveClass('compact');

    rerender({ props: { compact: false } });
    // Wait for the DOM update after rerender before asserting
    button = await screen.findByTestId('ps-button');
    expect(button).not.toHaveClass('compact');
  });

  // FIX APPLIED HERE - Added await after rerender
  it('applies the correct type attribute', async () => { // Made test async
    const { rerender } = render(PsButton, { props: { type: 'submit' } });
    // Wait for the DOM update after initial render
    let button = await screen.findByTestId('ps-button');
    expect(button).toHaveAttribute('type', 'submit');

    rerender({ props: { type: 'reset' } });
    // Wait for the DOM update after rerender before asserting
    button = await screen.findByTestId('ps-button');
    expect(button).toHaveAttribute('type', 'reset');

    rerender({ props: { type: 'button' } });
    // Wait for the DOM update after rerender before asserting
    button = await screen.findByTestId('ps-button');
    expect(button).toHaveAttribute('type', 'button');
  });


  it('calls the onclick function for default variant without confirmation', async () => {
    const { user, confirmMock } = setup();
    const onclickMock = vi.fn();
    render(PsButton, { props: { onclick: onclickMock } });
    const button = screen.getByTestId('ps-button');

    await user.click(button);

    expect(confirmMock).not.toHaveBeenCalled(); // No confirmation for default
    expect(onclickMock).toHaveBeenCalledTimes(1);
    // Optionally check the event object passed to onclickMock if needed
    // expect(onclickMock).toHaveBeenCalledWith(expect.any(MouseEvent));
  });

  it('calls the onclick function for add variant without confirmation', async () => {
    const { user, confirmMock } = setup();
    const onclickMock = vi.fn();
    render(PsButton, { props: { variant: 'add', onclick: onclickMock } });
    const button = screen.getByTestId('ps-button');

    await user.click(button);

    expect(confirmMock).not.toHaveBeenCalled(); // No confirmation for add
    expect(onclickMock).toHaveBeenCalledTimes(1);
  });

  it('calls confirm and onclick for remove variant when confirmed', async () => {
    const { user, confirmMock } = setup();
    // Make window.confirm return true (confirmed)
    confirmMock.mockReturnValue(true);
    const onclickMock = vi.fn();
    const customMessage = 'Proceed with caution?';

    render(PsButton, { props: { variant: 'remove', onclick: onclickMock, confirmMessage: customMessage } });
    const button = screen.getByTestId('ps-button');

    await user.click(button);

    // Confirm should have been called once with the correct message
    expect(confirmMock).toHaveBeenCalledTimes(1);
    expect(confirmMock).toHaveBeenCalledWith(customMessage);

    // onclick should have been called because confirm returned true
    expect(onclickMock).toHaveBeenCalledTimes(1);
  });

  it('calls confirm but NOT onclick for remove variant when cancelled', async () => {
    const { user, confirmMock } = setup();
    // Make window.confirm return false (cancelled)
    confirmMock.mockReturnValue(false);
    const onclickMock = vi.fn();
    const customMessage = 'Cancel this action?';

    render(PsButton, { props: { variant: 'remove', onclick: onclickMock, confirmMessage: customMessage } });
    const button = screen.getByTestId('ps-button');

    await user.click(button);

    // Confirm should have been called once with the correct message
    expect(confirmMock).toHaveBeenCalledTimes(1);
    expect(confirmMock).toHaveBeenCalledWith(customMessage);

    // onclick should NOT have been called because confirm returned false
    expect(onclickMock).not.toHaveBeenCalled();
  });

  it('uses the default confirm message if none is provided for remove variant', async () => {
     const { user, confirmMock } = setup();
     confirmMock.mockReturnValue(true); // Confirmed
     const onclickMock = vi.fn();

     // Render remove button without providing confirmMessage prop
     render(PsButton, { props: { variant: 'remove', onclick: onclickMock } });
     const button = screen.getByTestId('ps-button');

     await user.click(button);

     // Confirm should be called with the default message
     expect(confirmMock).toHaveBeenCalledTimes(1);
     expect(confirmMock).toHaveBeenCalledWith('Are you sure you want to delete this item?');
     expect(onclickMock).toHaveBeenCalledTimes(1); // Action should proceed if confirmed
  });
});