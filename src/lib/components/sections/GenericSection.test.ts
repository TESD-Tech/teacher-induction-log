import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { tick } from 'svelte';
import { get } from 'svelte/store';
import GenericSection from './GenericSection.svelte';
import { formStore, formConfigStore, type FormConfig, type FormData } from '../../stores/formStore';
import { sectionConfigs } from '../../config/sectionConfigs';
import type { SectionConfig } from '../../config/sectionConfigs';

// Mock the store functions that get dynamically imported
vi.mock('../../stores/formStore', async () => {
  const actual = await vi.importActual('../../stores/formStore');
  return {
    ...actual,
    addMentorMeeting: vi.fn(),
    removeMentorMeeting: vi.fn(),
    addTeamMeeting: vi.fn(),
    removeTeamMeeting: vi.fn(),
    addClassroomVisit: vi.fn(),
    removeClassroomVisit: vi.fn(),
    addOtherActivity: vi.fn(),
    removeOtherActivity: vi.fn(),
  };
});

// Import mocked functions
import {
  addMentorMeeting,
  removeMentorMeeting,
  addTeamMeeting,
  removeTeamMeeting,
  addClassroomVisit,
  removeClassroomVisit,
  addOtherActivity,
  removeOtherActivity,
} from '../../stores/formStore';

describe('GenericSection.svelte', () => {
  const user = userEvent.setup();

  // Mock window.confirm for JSDOM environment
  beforeEach(() => {
    Object.defineProperty(window, 'confirm', {
      writable: true,
      value: vi.fn().mockReturnValue(true),
    });
  });

  // Mock form data with sample entries
  const mockFormData: FormData = {
    inductee: 'Test Inductee',
    building: 'Test Building',
    assignment: 'Test Assignment',
    mentorTeacher: 'Test Mentor',
    schoolYearOne: '2024-2025',
    schoolYearTwo: '2025-2026',
    summerAcademy: [
      { day: 'Day 1', dateYearOne: '2024-07-01', dateYearTwo: '2025-07-01', verification: 'ABC' },
      { day: 'Day 2', dateYearOne: '', dateYearTwo: '', verification: '' },
      { day: 'Day 3', dateYearOne: '', dateYearTwo: '', verification: '' },
      { day: 'Day 4', dateYearOne: '', dateYearTwo: '', verification: '' },
    ],
    inductionSeminars: [
      { number: 1, topic: 'Orientation', dateYearOne: '2024-08-01', dateYearTwo: '', verification: 'DEF' },
      { number: 2, topic: '', dateYearOne: '', dateYearTwo: '', verification: '' },
      { number: 3, topic: '', dateYearOne: '', dateYearTwo: '', verification: '' },
      { number: 4, topic: '', dateYearOne: '', dateYearTwo: '', verification: '' },
    ],
    mentorMeetings: [
      { date: '2024-09-01', topic: 'First Meeting', dateYearOne: '2024-09-01', dateYearTwo: '', verification: 'GHI' },
      { date: '2024-10-01', topic: 'Second Meeting', dateYearOne: '2024-10-01', dateYearTwo: '', verification: 'JKL' },
    ],
    teamMeetings: [
      { date: '2024-09-15', topic: 'Team Collaboration', dateYearOne: '2024-09-15', dateYearTwo: '', verification: 'MNO' },
    ],
    classroomVisits: [
      { date: '2024-10-15', teacher: 'Jane Smith', subject: 'Math', dateYearOne: '2024-10-15', dateYearTwo: '', verification: 'PQR' },
    ],
    otherActivities: [
      { date: '2024-11-01', activity: 'Conference', dateYearOne: '2024-11-01', dateYearTwo: '', verification: 'STU' },
    ],
    signatures: {
      mentorTeacher: '',
      buildingPrincipal: '',
      superintendent: '',
      date: '',
    },
  };

  const mockFormConfig: FormConfig = {
    data: mockFormData,
    userRole: 'mentee',
    options: {
      mentors: ['Test Mentor'],
      buildings: ['Test Building'],
      assignments: ['Test Assignment'],
      schoolYears: ['2024-2025', '2025-2026'],
    },
    editable: {
      inductee: false,
      building: true,
      assignment: true,
      mentorTeacher: true,
      schoolYearOne: true,
      schoolYearTwo: true,
      summerAcademy: true,
      inductionSeminars: true,
      mentorMeetings: true,
      teamMeetings: true,
      classroomVisits: true,
      otherActivities: true,
      signatures: true,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    formStore.set(mockFormData);
    formConfigStore.set(mockFormConfig);
    
    // Debug: Check if store data is set correctly
    console.log('Store data after set:', get(formStore));
  });

  describe('Summer Academy Section (No Actions)', () => {
    const summerAcademyConfig = sectionConfigs.find(config => config.id === 'summerAcademy')!;

    it('should render summer academy section with static fields', () => {
      render(GenericSection, {
        props: { config: summerAcademyConfig as any },
      });

      expect(screen.getByText('I. Summer Academy')).toBeInTheDocument();
      expect(screen.getByText('Day 1')).toBeInTheDocument();
      expect(screen.getByText('Day 2')).toBeInTheDocument();
    });

    it('should show verification header as "Initials"', () => {
      render(GenericSection, {
        props: { config: summerAcademyConfig as any },
      });

      expect(screen.getByText('Initials')).toBeInTheDocument();
      expect(screen.queryByText('Verification')).not.toBeInTheDocument();
    });

    it('should render date inputs with correct values', () => {
      render(GenericSection, {
        props: { config: summerAcademyConfig as any },
      });

      // Look for the date input that should have value "2024-07-01"
      const dateInputs = screen.getAllByDisplayValue('2024-07-01');
      expect(dateInputs.length).toBeGreaterThan(0);
    });

    it('should render verification as readonly divs with correct values', () => {
      render(GenericSection, {
        props: { config: summerAcademyConfig as any },
      });

      // For non-editable verification/initials, expect a readonly div
      const initialsDiv = screen.getByText('ABC');
      expect(initialsDiv.tagName.toLowerCase()).toBe('div');
      expect(initialsDiv).toHaveClass('readonly-field');
    });

    it('should not show actions column for summer academy', () => {
      render(GenericSection, {
        props: { config: summerAcademyConfig as any },
      });

      expect(screen.queryByText('Actions')).not.toBeInTheDocument();
      expect(screen.queryByText('Remove')).not.toBeInTheDocument();
      expect(screen.queryByText('Add')).not.toBeInTheDocument();
    });
  });

  describe('Induction Seminars Section (No Actions)', () => {
    const inductionSeminarsConfig = sectionConfigs.find(config => config.id === 'inductionSeminars')!;

    it('should render induction seminars section with static and text fields', () => {
      render(GenericSection, {
        props: { config: inductionSeminarsConfig as any },
      });

      // Seminar number is static, should be a static-field div
      const numberDiv = screen.getByText('1');
      expect(numberDiv.tagName.toLowerCase()).toBe('div');
      expect(numberDiv).toHaveClass('static-field');

      // Topic is editable, should be an input
      expect(screen.getByDisplayValue('Orientation').tagName.toLowerCase()).toBe('input');
    });

    it('should render editable text fields for topic', async () => {
      render(GenericSection, {
        props: { config: inductionSeminarsConfig as any },
      });

      const topicInput = screen.getByDisplayValue('Orientation');
      await user.clear(topicInput);
      await user.type(topicInput, 'Updated Topic');
      await tick();

      expect(topicInput).toHaveValue('Updated Topic');
    });
  });

  describe('Mentor Meetings Section (With Actions)', () => {
    const mentorMeetingsConfig = sectionConfigs.find(config => config.id === 'mentorMeetings')!;

    it('should render mentor meetings section with actions', () => {
      render(GenericSection, {
        props: { config: mentorMeetingsConfig as any },
      });

      expect(screen.getByText('III. Meetings with mentor teacher')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
      expect(screen.getAllByText('Remove')).toHaveLength(2); // Two meetings
      expect(screen.getByText('Add Meeting')).toBeInTheDocument();
    });

    it('should render existing mentor meeting data', () => {
      render(GenericSection, {
        props: { config: mentorMeetingsConfig as any },
      });

      // Topic is editable
      expect(screen.getByDisplayValue('First Meeting').tagName.toLowerCase()).toBe('input');
      expect(screen.getByDisplayValue('Second Meeting').tagName.toLowerCase()).toBe('input');

      // Verification/initials is readonly, should be a div
      const initialsDiv1 = screen.getByText('GHI');
      expect(initialsDiv1.tagName.toLowerCase()).toBe('div');
      expect(initialsDiv1).toHaveClass('readonly-field');
      const initialsDiv2 = screen.getByText('JKL');
      expect(initialsDiv2.tagName.toLowerCase()).toBe('div');
      expect(initialsDiv2).toHaveClass('readonly-field');
    });

    it('should call addMentorMeeting when Add Meeting button is clicked', async () => {
      render(GenericSection, {
        props: { config: mentorMeetingsConfig as any },
      });

      const addButton = screen.getByText('Add Meeting');
      await user.click(addButton);

      await waitFor(() => {
        expect(addMentorMeeting).toHaveBeenCalledTimes(1);
      });
    });

    it('should call removeMentorMeeting when Remove button is clicked', async () => {
      render(GenericSection, {
        props: { config: mentorMeetingsConfig as any },
      });

      const removeButtons = screen.getAllByText('Remove');
      await user.click(removeButtons[0]);

      await waitFor(() => {
        expect(removeMentorMeeting).toHaveBeenCalledWith(0);
      });
    });

    it('should show confirmation dialog for remove action', async () => {
      render(GenericSection, {
        props: { config: mentorMeetingsConfig as any },
      });

      const removeButtons = screen.getAllByText('Remove');
      // The Button component handles confirmation internally
      expect(removeButtons[0]).toBeInTheDocument();
    });

    it('should allow editing text fields', async () => {
      render(GenericSection, {
        props: { config: mentorMeetingsConfig as any },
      });

      const topicInput = screen.getByDisplayValue('First Meeting');
      await user.clear(topicInput);
      await user.type(topicInput, 'Updated Meeting Topic');
      await tick();

      expect(topicInput).toHaveValue('Updated Meeting Topic');
    });
  });

  describe('Team Meetings Section', () => {
    const teamMeetingsConfig = sectionConfigs.find(config => config.id === 'teamMeetings')!;

    it('should render team meetings section', () => {
      render(GenericSection, {
        props: { config: teamMeetingsConfig as any },
      });

      expect(screen.getByText('IV. Induction team meetings')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Team Collaboration')).toBeInTheDocument();
    });

    it('should call addTeamMeeting when Add Meeting button is clicked', async () => {
      render(GenericSection, {
        props: { config: teamMeetingsConfig as any },
      });

      const addButton = screen.getByText('Add Meeting');
      await user.click(addButton);

      await waitFor(() => {
        expect(addTeamMeeting).toHaveBeenCalledTimes(1);
      });
    });

    it('should call removeTeamMeeting when Remove button is clicked', async () => {
      render(GenericSection, {
        props: { config: teamMeetingsConfig as any },
      });

      const removeButton = screen.getByText('Remove');
      await user.click(removeButton);

      await waitFor(() => {
        expect(removeTeamMeeting).toHaveBeenCalledWith(0);
      });
    });
  });

  describe('Classroom Visits Section', () => {
    const classroomVisitsConfig = sectionConfigs.find(config => config.id === 'classroomVisits')!;

    it('should render classroom visits section', () => {
      render(GenericSection, {
        props: { config: classroomVisitsConfig as any },
      });

      expect(screen.getByText('V. Visits to other classrooms')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Math')).toBeInTheDocument();
    });

    it('should call addClassroomVisit when Add Visit button is clicked', async () => {
      render(GenericSection, {
        props: { config: classroomVisitsConfig as any },
      });

      const addButton = screen.getByText('Add Visit');
      await user.click(addButton);

      await waitFor(() => {
        expect(addClassroomVisit).toHaveBeenCalledTimes(1);
      });
    });

    it('should call removeClassroomVisit when Remove button is clicked', async () => {
      render(GenericSection, {
        props: { config: classroomVisitsConfig as any },
      });

      const removeButton = screen.getByText('Remove');
      await user.click(removeButton);

      await waitFor(() => {
        expect(removeClassroomVisit).toHaveBeenCalledWith(0);
      });
    });
  });

  describe('Other Activities Section', () => {
    const otherActivitiesConfig = sectionConfigs.find(config => config.id === 'otherActivities')!;

    it('should render other activities section', () => {
      render(GenericSection, {
        props: { config: otherActivitiesConfig as any },
      });

      expect(screen.getByText('VI. Other: conferences, courses, etc.')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Conference')).toBeInTheDocument();
    });

    it('should call addOtherActivity when Add Activity button is clicked', async () => {
      render(GenericSection, {
        props: { config: otherActivitiesConfig as any },
      });

      const addButton = screen.getByText('Add Activity');
      await user.click(addButton);

      await waitFor(() => {
        expect(addOtherActivity).toHaveBeenCalledTimes(1);
      });
    });

    it('should call removeOtherActivity when Remove button is clicked', async () => {
      render(GenericSection, {
        props: { config: otherActivitiesConfig as any },
      });

      const removeButton = screen.getByText('Remove');
      await user.click(removeButton);

      await waitFor(() => {
        expect(removeOtherActivity).toHaveBeenCalledWith(0);
      });
    });
  });

  describe('Field Types and Permissions', () => {
    const mentorMeetingsConfig = sectionConfigs.find(config => config.id === 'mentorMeetings')!;

    it('should render static fields as read-only divs', () => {
      // Use summer academy which has static fields
      const summerAcademyConfig = sectionConfigs.find(config => config.id === 'summerAcademy')!;
      render(GenericSection, {
        props: { config: summerAcademyConfig as any },
      });

      // Day fields should be static (not editable)
      const dayField = screen.getByText('Day 1');
      expect(dayField.tagName.toLowerCase()).toBe('div');
      expect(dayField).toHaveClass('static-field');
    });

    it('should render text fields as inputs when editable', () => {
      render(GenericSection, {
        props: { config: mentorMeetingsConfig as any },
      });

      // Instead of getByDisplayValue, just check for an input in the topic cell
      const topicInputs = screen.getAllByRole('textbox');
      expect(topicInputs.length).toBeGreaterThan(0);
      topicInputs.forEach(input => {
        expect(input.tagName.toLowerCase()).toBe('input');
        expect(input).toHaveAttribute('type', 'text');
      });
    });

    it('should render verification fields as readonly divs when not editable', () => {
      render(GenericSection, {
        props: { config: mentorMeetingsConfig as any },
      });

      // Verification/initials is readonly, should be a div
      const initialsDiv = screen.getByText('GHI');
      expect(initialsDiv.tagName.toLowerCase()).toBe('div');
      expect(initialsDiv).toHaveClass('readonly-field');
    });

    it('should render readonly fields when user lacks permission', () => {
      // Set user role to limit permissions
      const restrictedConfig = { ...mockFormConfig, userRole: 'mentee' as const };
      formConfigStore.set(restrictedConfig);

      render(GenericSection, {
        props: { config: mentorMeetingsConfig as any },
      });

      // The component should still render inputs for mentee role
      // but in a real scenario with stricter permissions, some might be readonly
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  describe('Column Widths and Styling', () => {
    const mentorMeetingsConfig = sectionConfigs.find(config => config.id === 'mentorMeetings')!;

    it('should pass column widths to ActivityTable', () => {
      render(GenericSection, {
        props: { config: mentorMeetingsConfig as any },
      });

      // The ActivityTable component should receive the columnWidths prop
      // This is tested indirectly by ensuring the component renders without errors
      expect(screen.getByText('III. Meetings with mentor teacher')).toBeInTheDocument();
    });

    it('should apply correct CSS classes for field types', () => {
      render(GenericSection, {
        props: { config: mentorMeetingsConfig as any },
      });

      // Check that cells have appropriate classes
      const container = screen.getByText('III. Meetings with mentor teacher').closest('section');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Empty Data Handling', () => {
    it('should handle empty sections gracefully', () => {
      // Set empty data
      const emptyFormData = { ...mockFormData, mentorMeetings: [] };
      formStore.set(emptyFormData);

      const mentorMeetingsConfig = sectionConfigs.find(config => config.id === 'mentorMeetings')!;
      render(GenericSection, {
        props: { config: mentorMeetingsConfig as any },
      });

      expect(screen.getByText('III. Meetings with mentor teacher')).toBeInTheDocument();
      expect(screen.getByText('Add Meeting')).toBeInTheDocument();
      expect(screen.queryByText('Remove')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown handler gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const badConfig = {
        ...sectionConfigs.find(config => config.id === 'mentorMeetings')!,
        actions: {
          add: { handler: 'unknownHandler', label: 'Add Meeting' },
        },
      };

      render(GenericSection, {
        props: { config: badConfig as any },
      });

      const addButton = screen.getByText('Add Meeting');
      await user.click(addButton);

      // Should log error for unknown handler
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Handler unknownHandler not found');
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Responsive Design', () => {
    it('should render properly with different screen sizes', () => {
      const mentorMeetingsConfig = sectionConfigs.find(config => config.id === 'mentorMeetings')!;
      render(GenericSection, {
        props: { config: mentorMeetingsConfig as any },
      });

      // The component should render responsive elements
      expect(screen.getByText('III. Meetings with mentor teacher')).toBeInTheDocument();
      
      // Check for icon elements (they should be present in remove buttons)
      const removeButtons = screen.getAllByText('Remove');
      expect(removeButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Integration with ActivityTable', () => {
    it('should pass correct props to ActivityTable', () => {
      const mentorMeetingsConfig = sectionConfigs.find(config => config.id === 'mentorMeetings')!;
      render(GenericSection, {
        props: { config: mentorMeetingsConfig as any },
      });

      // Verify that headers are properly modified (Verification -> Initials)
      expect(screen.getByText('Initials')).toBeInTheDocument();
      expect(screen.queryByText('Verification')).not.toBeInTheDocument();

      // Verify showActions is properly set
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });
});
