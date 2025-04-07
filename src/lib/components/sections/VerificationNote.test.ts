import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import VerificationNote from './VerificationNote.svelte';

describe('VerificationNote Component', () => {
  it('should render correctly', () => {
    const { getByText } = render(VerificationNote);
    
    const noteText = getByText('On the date of each activity, this log must be initialed by the mentor teacher, principal or seminar coordinator.');
    expect(noteText).toBeInTheDocument();
  });

  it('should have the correct structure', () => {
    const { container } = render(VerificationNote);
    
    // Get the div with class 'verification-note'
    const noteElement = container.querySelector('.verification-note');
    expect(noteElement).not.toBeNull();
    
    // Check that it contains a paragraph
    const paragraphElement = noteElement?.querySelector('p');
    expect(paragraphElement).not.toBeNull();
    
    // Check that the content is correct
    expect(paragraphElement?.textContent).toBe(
      'On the date of each activity, this log must be initialed by the mentor teacher, principal or seminar coordinator.'
    );
  });

  it('should have the verification-note class', () => {
    const { container } = render(VerificationNote);
    
    const noteElement = container.querySelector('.verification-note');
    expect(noteElement).not.toBeNull();
    expect(noteElement?.classList.contains('verification-note')).toBe(true);
  });
});
