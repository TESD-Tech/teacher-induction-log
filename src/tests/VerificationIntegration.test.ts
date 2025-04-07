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
      userRole: 'teacher',
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

  it('should render verification fields as read-only for teachers', async () => {
    const { getAllByDisplayValue } = render(InductionLog);

    // The verification input should be disabled or read-only
    const verificationInputs = getAllByDisplayValue('BJK');
    expect(verificationInputs.length).toBeGreaterThan(0);

    verificationInputs.forEach(input => {
      expect(input).toHaveAttribute('readonly');
    });
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

  it('should prevent teacher from editing verification fields and show error on attempt', async () => {
    const { getAllByDisplayValue } = render(InductionLog);

    const verificationInputs = getAllByDisplayValue('BJK');
    expect(verificationInputs.length).toBeGreaterThan(0);

    for (const input of verificationInputs) {
      expect(input).toHaveAttribute('readonly');

      // Try to simulate input event
      await fireEvent.input(input, { target: { value: 'NEW' } });

      // The value should remain unchanged
      expect(input).toHaveValue('BJK');
    }
    // TODO: If app shows error message or toast, assert it here
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