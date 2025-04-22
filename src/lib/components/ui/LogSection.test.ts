import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import LogSection from './LogSection.svelte';

// Note about slot testing in Svelte 5:
// Testing slots directly is challenging with the current testing utilities.
// For comprehensive slot testing, consider using component
// integration tests or a different testing approach.

describe('LogSection Component', () => {
  it('renders with the provided title', () => {
    const { container } = render(LogSection, { title: 'Test Section' });
    
    // Find the title element
    const titleElement = container.querySelector('.section-title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('Test Section');
  });

  it('renders with a container for slot content', () => {
    const { container } = render(LogSection, { title: 'Test Section' });
    
    // Check if the section-content container exists
    const contentContainer = container.querySelector('.section-content');
    expect(contentContainer).toBeInTheDocument();
  });

  it('uses the provided title text', () => {
    const customTitle = 'Custom Section Title';
    const { container } = render(LogSection, { title: customTitle });
    
    // Verify the custom title is used
    const titleElement = container.querySelector('.section-title');
    expect(titleElement).toHaveTextContent(customTitle);
  });

  it('renders with a semantic section element', () => {
    const { container } = render(LogSection, { title: 'Test Section' });
    
    // Check if the component uses a semantic section element
    const sectionElement = container.querySelector('section.log-section');
    expect(sectionElement).toBeInTheDocument();
  });

  it('renders with h3 element for the title', () => {
    const { container } = render(LogSection, { title: 'Test Section' });
    
    // Check if the title uses an h3 element
    const titleElement = container.querySelector('h3.section-title');
    expect(titleElement).toBeInTheDocument();
  });

  it('applies styling to the section element', () => {
    const { container } = render(LogSection, { title: 'Test Section' });
    
    // Check if the section has appropriate styling classes
    const sectionElement = container.querySelector('.log-section');
    expect(sectionElement).toBeInTheDocument();
    expect(sectionElement).toHaveClass('log-section');
  });

  it('structures the content with title followed by content area', () => {
    const { container } = render(LogSection, { title: 'Test Section' });
    
    // Get elements
    const sectionElement = container.querySelector('.log-section');
    const titleElement = container.querySelector('.section-title');
    const contentContainer = container.querySelector('.section-content');
    
    // Verify structure (title comes before content)
    const titleIndex = Array.from(sectionElement.children).indexOf(titleElement);
    const contentIndex = Array.from(sectionElement.children).indexOf(contentContainer);
    
    expect(titleIndex).toBeLessThan(contentIndex);
  });
  
  it('ensures the content container is empty by default', () => {
    const { container } = render(LogSection, { title: 'Test Section' });
    
    const contentContainer = container.querySelector('.section-content');
    expect(contentContainer.children.length).toBe(0);
  });
  
  it('contains appropriate accessibility structure', () => {
    const { container } = render(LogSection, { title: 'Test Section' });
    
    // Verify h3 is used for section title (correct heading hierarchy)
    const titleElement = container.querySelector('h3.section-title');
    expect(titleElement).toBeInTheDocument();
    
    // Verify semantic section element is used
    const sectionElement = container.querySelector('section.log-section');
    expect(sectionElement).toBeInTheDocument();
  });
});
