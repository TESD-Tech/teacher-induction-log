import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import VerificationNote from './VerificationNote.svelte';

describe('VerificationNote.svelte', () => {
  it('renders the verification note text', () => {
    render(VerificationNote);
    
    expect(screen.getByText(/on the date of each activity/i)).toBeInTheDocument();
    expect(screen.getByText(/initialed by the mentor teacher/i)).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(VerificationNote);
    
    const noteDiv = container.querySelector('.verification-note');
    expect(noteDiv).toBeInTheDocument();
  });

  it('displays the complete verification message', () => {
    render(VerificationNote);
    
    const expectedText = 'On the date of each activity, this log must be initialed by the mentor teacher, principal or seminar coordinator.';
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});
