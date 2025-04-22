import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import FormRow from './FormRow.svelte';

describe('FormRow Component', () => {
  // Setup before tests
  beforeEach(() => {
    // Mock randomUUID so we can test id generation
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('mock-uuid-123');
  });

  // Cleanup after tests
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with a label', async () => {
    const { container } = render(FormRow, { label: 'Test Label' });
    
    // Find the label element
    const label = container.querySelector('.form-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Test Label');
  });

  it('renders the required indicator when required is true', async () => {
    const { container } = render(FormRow, { 
      label: 'Test Label', 
      required: true 
    });
    
    // Find the required indicator
    const indicator = container.querySelector('.required-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveTextContent('*');
  });

  it('does not render the required indicator when required is false', async () => {
    const { container } = render(FormRow, { 
      label: 'Test Label', 
      required: false 
    });
    
    // Check that required indicator is not present
    const indicator = container.querySelector('.required-indicator');
    expect(indicator).not.toBeInTheDocument();
  });

  it('renders help text when provided', async () => {
    const helpText = 'This is helpful text.';
    const { container } = render(FormRow, { 
      label: 'Test Label', 
      helpText 
    });
    
    // Find the help text element
    const helpTextElement = container.querySelector('.help-text');
    expect(helpTextElement).toBeInTheDocument();
    expect(helpTextElement).toHaveTextContent(helpText);
  });

  it('does not render help text when not provided', async () => {
    const { container } = render(FormRow, { 
      label: 'Test Label', 
      helpText: '' 
    });
    
    // Check that help text is not present
    const helpTextElement = container.querySelector('.help-text');
    expect(helpTextElement).not.toBeInTheDocument();
  });

  it('renders error message when hasError is true and errorMessage is provided', async () => {
    const errorMessage = 'This is an error message.';
    const { container } = render(FormRow, { 
      label: 'Test Label', 
      hasError: true, 
      errorMessage 
    });
    
    // Find the error message element
    const errorMessageElement = container.querySelector('.error-message');
    expect(errorMessageElement).toBeInTheDocument();
    expect(errorMessageElement).toHaveTextContent(errorMessage);
  });

  it('does not render error message when hasError is false', async () => {
    const errorMessage = 'This is an error message.';
    const { container } = render(FormRow, { 
      label: 'Test Label', 
      hasError: false, 
      errorMessage 
    });
    
    // Check that error message is not present
    const errorMessageElement = container.querySelector('.error-message');
    expect(errorMessageElement).not.toBeInTheDocument();
  });

  it('does not render error message when errorMessage is not provided', async () => {
    const { container } = render(FormRow, { 
      label: 'Test Label', 
      hasError: true, 
      errorMessage: '' 
    });
    
    // Check that error message is not present
    const errorMessageElement = container.querySelector('.error-message');
    expect(errorMessageElement).not.toBeInTheDocument();
  });

  it('adds the has-error class to the form-row element when hasError is true', async () => {
    const { container } = render(FormRow, { 
      label: 'Test Label', 
      hasError: true 
    });
    
    // Check that form-row has the has-error class
    const formRow = container.querySelector('.form-row');
    expect(formRow).toHaveClass('has-error');
  });

  it('uses the provided id attribute for the label for attribute', async () => {
    const customId = 'custom-id';
    const { container } = render(FormRow, { 
      label: 'Test Label', 
      id: customId 
    });
    
    // Check that the label's for attribute matches the provided id
    const label = container.querySelector('.form-label');
    expect(label).toHaveAttribute('for', customId);
  });

  it('generates a random id if none is provided', async () => {
    const { container } = render(FormRow, { 
      label: 'Test Label' 
    });
    
    // Check that the label has the mocked id as the for attribute
    const label = container.querySelector('.form-label');
    expect(label).toHaveAttribute('for', 'mock-uuid-123');
    
    // Verify that randomUUID was called
    expect(crypto.randomUUID).toHaveBeenCalled();
  });
  
  // Note: Testing slot content in Svelte 5 requires a different approach
  // For now, we're focusing on the component's core functionality
});
