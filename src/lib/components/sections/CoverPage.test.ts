import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import CoverPageTestWrapper from './CoverPageTestWrapper.svelte';
import CoverPage from './CoverPage.svelte';
import { setContext } from 'svelte';
import { writable } from 'svelte/store';
import { get } from 'svelte/store';

// Mock form store with mentor names
const mockFormStoreData = {
  mentorTeacher: '',
  mentorNames: ['Alice Smith', 'Bob Johnson', 'Carol Lee'],
  assignment: '',
  schoolYearOne: '',
  schoolYearTwo: '',
  inductionSeminars: [],
  mentorMeetings: [],
  teamMeetings: [],
  classroomVisits: [],
  otherActivities: [],
  signatures: {
    mentorTeacher: '',
    buildingPrincipal: ''
  }
};

const formStore = writable(mockFormStoreData);
const formConfigStore = writable({
  userRole: 'admin',
  editable: {
    assignment: true,
    mentorTeacher: true,
    schoolYearOne: true,
    schoolYearTwo: true,
    inductionSeminars: true,
    mentorMeetings: true,
    teamMeetings: true,
    classroomVisits: true,
    otherActivities: true,
    verifications: {
      inductionSeminars: true,
      mentorMeetings: true,
      teamMeetings: true,
      classroomVisits: true,
      otherActivities: true,
      summerAcademy: true
    }
  }
});

describe('CoverPage Mentor Dropdown', () => {
  it('renders mentor options from form data', () => {
    const { getByLabelText } = render(CoverPageTestWrapper, {
      props: {
        formStore,
        formConfigStore
      }
    });

    const select = getByLabelText('Mentor Teacher Name') as HTMLSelectElement;
    expect(select).toBeInTheDocument();

    // Check options
    const options = Array.from(select.options).map((opt) => opt.text);
    expect(options).toContain('Alice Smith');
    expect(options).toContain('Bob Johnson');
    expect(options).toContain('Carol Lee');
  });

  it('updates mentorTeacher in form data when selecting an option', async () => {
    const { getByLabelText } = render(CoverPageTestWrapper, {
      props: {
        formStore,
        formConfigStore
      }
    });

    const select = getByLabelText('Mentor Teacher Name') as HTMLSelectElement;

    await fireEvent.change(select, { target: { value: 'Bob Johnson' } });

    const storeValue = get(formStore);
    expect(storeValue.mentorTeacher).toBe('Bob Johnson');
  });
});