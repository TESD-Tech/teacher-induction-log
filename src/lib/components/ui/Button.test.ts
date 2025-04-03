import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Button Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
    
    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  it('renders with default variant', () => {
    render(Button, { 
      props: { 
        variant: 'default',
        type: 'button'
      } 
    });
    
    const button = screen.getByRole('button');
    expect(button).toBeTruthy();
    expect(button).toHaveClass('default');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders with add variant', () => {
    render(Button, { 
      props: { 
        variant: 'add',
        type: 'button'
      } 
    });
    
    const button = screen.getByRole('button');
    expect(button).toBeTruthy();
    expect(button).toHaveClass('add');
  });

  it('renders with remove variant', () => {
    render(Button, { 
      props: { 
        variant: 'remove',
        type: 'button'
      } 
    });
    
    const button = screen.getByRole('button');
    expect(button).toBeTruthy();
    expect(button).toHaveClass('remove');
  });

  it('renders with different button types', () => {
    // First render
    render(Button, { props: { type: 'submit' } });
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    
    // Clean up and render again
    document.body.innerHTML = '';
    render(Button, { props: { type: 'reset' } });
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('renders a button element', () => {
    // Simplified slot test - just make sure the button renders
    render(Button);
    const button = screen.getByRole('button');
    expect(button).toBeTruthy();
  });

  it('dispatches click event for non-remove buttons', async () => {
    // Set up mock handler function
    const handleClick = vi.fn();
    
    // Render component with an onclick handler
    render(Button, { 
      props: { 
        variant: 'default',
        onclick: handleClick
      }
    });
    
    // Click the button
    const button = screen.getByRole('button');
    await fireEvent.click(button);
    
    // Check if handler was called
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(window.confirm).not.toHaveBeenCalled();
  });

  it('shows confirmation dialog and dispatches click event when confirmed for remove buttons', async () => {
    // Set up mock handler function
    const handleClick = vi.fn();
    const confirmMessage = 'Are you sure?';
    
    // Render component with an onclick handler
    render(Button, { 
      props: { 
        variant: 'remove',
        confirmMessage,
        onclick: handleClick
      }
    });
    
    // Click the button
    const button = screen.getByRole('button');
    await fireEvent.click(button);
    
    // Check if confirm was called and handler was called
    expect(window.confirm).toHaveBeenCalledWith(confirmMessage);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not dispatch click event when confirmation is canceled for remove buttons', async () => {
    // Change the mock implementation for this test only
    vi.spyOn(window, 'confirm').mockImplementation(() => false);
    
    // Set up mock handler function
    const handleClick = vi.fn();
    
    // Render component with an onclick handler
    render(Button, { 
      props: { 
        variant: 'remove',
        onclick: handleClick
      }
    });
    
    // Click the button
    const button = screen.getByRole('button');
    await fireEvent.click(button);
    
    // Check if confirm was called but handler was not called
    expect(window.confirm).toHaveBeenCalled();
    expect(handleClick).not.toHaveBeenCalled();
  });
});