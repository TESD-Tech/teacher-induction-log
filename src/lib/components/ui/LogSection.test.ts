import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import LogSection from './LogSection.svelte';

describe('LogSection Component', () => {
  it('renders with the provided title', () => {
    render(LogSection, { 
      props: { 
        title: 'Test Section Title'
      }
    });
    
    expect(screen.getByText('Test Section Title')).toBeInTheDocument();
  });

  it('provides content container for slots', () => {
    const { container } = render(LogSection, { 
      props: { 
        title: 'Test Section'
      }
    });
    
    // Verify the section content container exists
    const sectionContent = container.querySelector('.section-content');
    expect(sectionContent).toBeTruthy();
  });

  it('has the correct structure and styling', () => {
    const { container } = render(LogSection, { 
      props: { 
        title: 'Test Section'
      }
    });
    
    // Check for section container
    const sectionDiv = container.querySelector('.log-section');
    expect(sectionDiv).toBeTruthy();
    
    // Check for heading
    const heading = container.querySelector('h3');
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe('Test Section');
    expect(heading).toHaveClass('section-title');
  });

  it('has the expected layout structure', () => {
    const { container } = render(LogSection, { 
      props: { 
        title: 'Section Layout Test'
      }
    });
    
    // Get elements
    const section = container.querySelector('.log-section');
    const heading = container.querySelector('h3.section-title');
    const content = container.querySelector('.section-content');
    
    // Verify structure - heading followed by content container
    expect(section.firstElementChild).toBe(heading);
    expect(heading.nextElementSibling).toBe(content);
  });
});