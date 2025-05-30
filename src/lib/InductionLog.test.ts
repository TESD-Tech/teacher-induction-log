import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import InductionLog from './InductionLog.svelte';

describe('InductionLog', () => {
  it('renders without crashing', () => {
    render(InductionLog);
    expect(screen.getByText('Teacher Induction Log')).toBeInTheDocument();
  });

  it('renders the CoverPage section', () => {
    render(InductionLog);
    expect(screen.getByText(/inductee information/i)).toBeInTheDocument();
  });

  it('renders all main sections', () => {
    render(InductionLog);
    expect(screen.getByText(/induction seminars/i)).toBeInTheDocument();
    expect(screen.getByText(/team meetings/i)).toBeInTheDocument();
    // Use the exact section title for classroom visits
    expect(screen.getByText('V. Visits to other classrooms')).toBeInTheDocument();
    // Use the exact section title for other activities
    expect(screen.getByText('VI. Other: conferences, courses, etc.')).toBeInTheDocument();
  });

  it('renders the ActionsBar with Print and Save buttons', () => {
    render(InductionLog);
    expect(screen.getByRole('button', { name: /print form/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save form/i })).toBeInTheDocument();
  });

  it('renders the Signatures and VerificationNote sections', () => {
    render(InductionLog);
    expect(screen.getByText(/signatures/i)).toBeInTheDocument();
    expect(screen.getByText(/certify that the above named inductee/i)).toBeInTheDocument();
  });
});
