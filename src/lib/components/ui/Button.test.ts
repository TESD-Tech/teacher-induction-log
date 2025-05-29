import { render, screen, fireEvent } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import Button from './Button.svelte';
import { tick } from 'svelte';

// Mock window.confirm
vi.stubGlobal('confirm', vi.fn());

describe('Button Component', () => {
  const setup = () => {
    return userEvent.setup();
  };

  // Restore original window.confirm after each test
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with default variant and type', async () => {
    const { container } = render(Button);
    
    // Need to select by class since the customElement directive might be affecting testid
    const button = container.querySelector('button.default');
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveClass('compact');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders with add variant', async () => {
    const { container } = render(Button, { variant: 'add' });
    
    const button = container.querySelector('button.add');
    expect(button).toBeInTheDocument();
  });

  it('renders with remove variant', async () => {
    const { container } = render(Button, { variant: 'remove' });
    
    const button = container.querySelector('button.remove');
    expect(button).toBeInTheDocument();
  });

  it('renders with compact prop', async () => {
    const { container } = render(Button, { compact: true });
    
    const button = container.querySelector('button.compact');
    expect(button).toBeInTheDocument();
  });

  it('sets the type attribute correctly', async () => {
    const { container } = render(Button, { type: 'submit' });
    
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('shows confirmation dialog for remove variant', async () => {
    const user = setup();
    
    // Mock confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    const { container } = render(Button, { 
      variant: 'remove',
    });
    
    const button = container.querySelector('button');
    
    // Click the button
    await user.click(button);
    
    // Check confirm was called with default message
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this item?');
  });

  it('shows confirmation dialog with custom message', async () => {
    const user = setup();
    const customMessage = 'Custom confirm message';
    
    // Mock confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    const { container } = render(Button, { 
      variant: 'remove',
      confirmMessage: customMessage
    });
    
    const button = container.querySelector('button');
    
    // Click the button
    await user.click(button);
    
    // Verify the custom message was used
    expect(confirmSpy).toHaveBeenCalledWith(customMessage);
  });

  it('calls the onclick handler when provided', async () => {
    const user = setup();
    const onClickHandler = vi.fn();
    
    const { container } = render(Button, { 
      onclick: onClickHandler
    });
    
    const button = container.querySelector('button');
    
    // Click the button
    await user.click(button);
    
    // Verify the handler was called
    expect(onClickHandler).toHaveBeenCalled();
  });

  it('does not call handler when remove variant is canceled', async () => {
    const user = setup();
    const onClickHandler = vi.fn();
    
    // Mock confirm to return false (user canceled)
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    
    const { container } = render(Button, { 
      variant: 'remove',
      onclick: onClickHandler
    });
    
    const button = container.querySelector('button');
    
    // Click the button
    await user.click(button);
    
    // Handler should not be called if confirm is canceled
    expect(onClickHandler).not.toHaveBeenCalled();
  });

  it('does not throw or call onclick when remove variant is clicked and confirm is false and no onclick is provided', async () => {
    const user = setup();
    // Mock confirm to return false
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    // Render with remove variant and no onclick
    const { container } = render(Button, { variant: 'remove' });
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    // Should not throw or call any handler
    if (button) {
      await expect(user.click(button)).resolves.not.toThrow();
    }
  });

  it('does not throw when default variant is clicked and no onclick is provided', async () => {
    const user = setup();
    const { container } = render(Button); // default variant, no onclick
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    if (button) {
      await expect(user.click(button)).resolves.not.toThrow();
    }
  });

  it('does not throw when remove variant is clicked, confirm is true, and no onclick is provided', async () => {
    const user = setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { container } = render(Button, { variant: 'remove' });
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    if (button) {
      await expect(user.click(button)).resolves.not.toThrow();
    }
  });

  it('renders with remove variant and compact prop', async () => {
    const { container } = render(Button, { variant: 'remove', compact: true });
    const button = container.querySelector('button.remove.compact');
    expect(button).toBeInTheDocument();
  });

  it('renders with add variant and compact prop', async () => {
    const { container } = render(Button, { variant: 'add', compact: true });
    const button = container.querySelector('button.add.compact');
    expect(button).toBeInTheDocument();
  });

});
