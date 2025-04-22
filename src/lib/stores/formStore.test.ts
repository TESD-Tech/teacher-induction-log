// Import necessary modules and the store
import { describe, it, expect, vi } from 'vitest';
import { tick } from 'svelte';
import { get } from 'svelte/store';
import { formStore, formConfigStore, addMentorMeeting, removeMentorMeeting, saveForm, setFormConfig, createEmptyActivity, type UserRole } from './formStore';

describe('formStore', () => {
  it('should initialize with correct default values', () => {
    const formState = get(formStore);
    expect(formState.inductee).toBe('');
    expect(formState.summerAcademy.length).toBe(4);
    expect(formState.mentorMeetings.length).toBe(1);
  });

  it('should add a mentor meeting', () => {
    addMentorMeeting();
    const formState = get(formStore);
    expect(formState.mentorMeetings.length).toBe(2);
  });

  it('should remove a mentor meeting', async () => {
    formStore.update(data => ({
      ...data,
      mentorMeetings: [createEmptyActivity({ date: '', topic: '' })]
    })); // Ensure exactly one meeting exists
    removeMentorMeeting(0);
    await tick(); // Ensure the store update is processed
    const formState = get(formStore);
    expect(formState.mentorMeetings.length).toBe(0);
  });

  it('should save form data correctly', () => {
    const mockGetElementById = vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'json_clob') {
        return {
          value: '',
          closest: vi.fn().mockReturnValue({
            submit: vi.fn().mockImplementation(() => {
              // console.log('Form submitted (mocked)'); // Removed console log
            }),
          }),
        } as unknown as HTMLInputElement;
      }
      return null;
    });

    saveForm();

    mockGetElementById.mockRestore(); // Clean up the mock
    const formState = get(formStore);
    const jsonString = JSON.stringify(formState);
    const expectedJson = '{"inductee":"","building":"","assignment":"","mentorTeacher":"","schoolYearOne":"","schoolYearTwo":"","summerAcademy":[{"dateYearOne":"","dateYearTwo":"","verification":"","day":"Day 1"},{"dateYearOne":"","dateYearTwo":"","verification":"","day":"Day 2"},{"dateYearOne":"","dateYearTwo":"","verification":"","day":"Day 3"},{"dateYearOne":"","dateYearTwo":"","verification":"","day":"Day 4"}],"inductionSeminars":[{"dateYearOne":"","dateYearTwo":"","verification":"","number":1,"topic":""},{"dateYearOne":"","dateYearTwo":"","verification":"","number":2,"topic":""},{"dateYearOne":"","dateYearTwo":"","verification":"","number":3,"topic":""},{"dateYearOne":"","dateYearTwo":"","verification":"","number":4,"topic":""}],"mentorMeetings":[],"teamMeetings":[{"dateYearOne":"","dateYearTwo":"","verification":"","date":"","topic":""}],"classroomVisits":[{"dateYearOne":"","dateYearTwo":"","verification":"","date":"","teacher":"","subject":""}],"otherActivities":[{"dateYearOne":"","dateYearTwo":"","verification":"","date":"","activity":""}],"signatures":{"mentorTeacher":"","buildingPrincipal":"","superintendent":"","date":""}}';
    expect(jsonString).toBe(expectedJson);
  });

  it('should set form configuration correctly', () => {
    const newConfig = {
      data: { ...get(formStore), inductee: 'Test Inductee' },
      userRole: 'admin' as UserRole,
      options: { mentors: ['Mentor1'], buildings: ['Building1'], assignments: ['Assignment1'], schoolYears: ['2025'] },
      editable: {
        inductee: true,
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
        signatures: true
      }
    };
    setFormConfig(newConfig);
    const configState = get(formConfigStore);
    expect(configState.data.inductee).toBe('Test Inductee');
  });
});