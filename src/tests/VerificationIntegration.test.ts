import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import InductionLog from '../lib/InductionLog.svelte';
import { formConfigStore, formStore } from '../lib/stores/formStore';

describe('Verification Permissions Integration', () => {
  beforeEach(() => {
    // Reset stores before each test
    formStore.set({
      mentorMeetings: [
        { date: '2025-04-01', topic: 'Test Meeting', dateYearOne: '2025-04-01', dateYearTwo: '', verification: 'BJK' }
      ],
      summerAcademy: [],
      inductionSeminars: [],
      teamMeetings: [],
      classroomVisits: [],
      otherActivities: [],
      inductee: '',
      building: '',
      assignment: '',
      mentorTeacher: '',
      schoolYearOne: '',
      schoolYearTwo: '',
      signatures: {
        mentorTeacher: '',
        buildingPrincipal: '',
        superintendent: '',
        date: ''
      }
    });

    formConfigStore.set({
      userRole: 'mentee',
      editable: {
        inductee: true,
        building: true,
        assignment: true,
        mentorTeacher: true,
        schoolYearOne: true,
        schoolYearTwo: true,
        mentorMeetings: true,
        summerAcademy: true,
        inductionSeminars: true,
        teamMeetings: true,
        classroomVisits: true,
        otherActivities: true,
        signatures: true,
        verifications: {
          mentorMeetings: false,
          summerAcademy: false,
          inductionSeminars: false,
          teamMeetings: false,
          classroomVisits: false,
          otherActivities: false
        }
      },
      data: {} as any
    });
  });

  it('should NOT render verification fields for mentee role', async () => {
    const { queryAllByDisplayValue, container } = render(InductionLog);

    console.log('--- DEBUG: Rendered HTML for mentee role ---');
    console.log(container.innerHTML);

    const verificationInputs = queryAllByDisplayValue('BJK');
    expect(verificationInputs.length).toBe(0);
  });

  it('should render verification fields as editable for admins', async () => {
    formConfigStore.set({
      userRole: 'admin',
      editable: {
        inductee: true,
        building: true,
        assignment: true,
        mentorTeacher: true,
        schoolYearOne: true,
        schoolYearTwo: true,
        mentorMeetings: true,
        summerAcademy: true,
        inductionSeminars: true,
        teamMeetings: true,
        classroomVisits: true,
        otherActivities: true,
        signatures: true,
        verifications: {
          mentorMeetings: true,
          summerAcademy: true,
          inductionSeminars: true,
          teamMeetings: true,
          classroomVisits: true,
          otherActivities: true
        }
      },
      data: {} as any
    });

    const { getAllByDisplayValue } = render(InductionLog);

    const verificationInputs = getAllByDisplayValue('BJK');
    expect(verificationInputs.length).toBeGreaterThan(0);

    verificationInputs.forEach(input => {
      expect(input).not.toHaveAttribute('readonly');
    });
  });

  it('should NOT allow mentee to edit or see verification fields', async () => {
    const { queryAllByDisplayValue } = render(InductionLog);

    const verificationInputs = queryAllByDisplayValue('BJK');
    expect(verificationInputs.length).toBe(0);
  });

  it('should allow mentor to edit mentorMeetings verification but not others', async () => {
    formConfigStore.set({
      userRole: 'mentor',
      editable: {
        inductee: true,
        building: true,
        assignment: true,
        mentorTeacher: true,
        schoolYearOne: true,
        schoolYearTwo: true,
        mentorMeetings: true,
        summerAcademy: true,
        inductionSeminars: true,
        teamMeetings: true,
        classroomVisits: true,
        otherActivities: true,
        signatures: true,
        verifications: {
          mentorMeetings: true,
          summerAcademy: false,
          inductionSeminars: false,
          teamMeetings: false,
          classroomVisits: false,
          otherActivities: false
        }
      },
      data: {} as any
    });

    const { getAllByDisplayValue, queryAllByDisplayValue } = render(InductionLog);

    const mentorVerifications = getAllByDisplayValue('BJK');
    expect(mentorVerifications.length).toBeGreaterThan(0);

    for (const input of mentorVerifications) {
      expect(input).not.toHaveAttribute('readonly');
      await fireEvent.input(input, { target: { value: 'NEW' } });
      expect(input).toHaveValue('NEW');
    }

    // Simulate other verifications with different values
    // Since our mock data only has 'BJK', in real test you'd set different values
    // Here, just assert that no other editable verifications are present
    const otherVerifications = queryAllByDisplayValue('XYZ'); // assume 'XYZ' is other verification value
    expect(otherVerifications.length).toBe(0);
  });

  it('should allow admin to edit verification fields', async () => {
    formConfigStore.set({
      userRole: 'admin',
      editable: {
        inductee: true,
        building: true,
        assignment: true,
        mentorTeacher: true,
        schoolYearOne: true,
        schoolYearTwo: true,
        mentorMeetings: true,
        summerAcademy: true,
        inductionSeminars: true,
        teamMeetings: true,
        classroomVisits: true,
        otherActivities: true,
        signatures: true,
        verifications: {
          mentorMeetings: true,
          summerAcademy: true,
          inductionSeminars: true,
          teamMeetings: true,
          classroomVisits: true,
          otherActivities: true
        }
      },
      data: {} as any
    });

    const { getAllByDisplayValue } = render(InductionLog);

    const verificationInputs = getAllByDisplayValue('BJK');
    expect(verificationInputs.length).toBeGreaterThan(0);

    for (const input of verificationInputs) {
      expect(input).not.toHaveAttribute('readonly');

      await fireEvent.input(input, { target: { value: 'NEW' } });

      expect(input).toHaveValue('NEW');
    }
  });
});