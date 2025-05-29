// Import necessary modules and the store
import { describe, it, expect, vi } from 'vitest';
import { tick } from 'svelte';
import { get } from 'svelte/store';
import { formStore, formConfigStore, addMentorMeeting, removeMentorMeeting, saveForm, setFormConfig, createEmptyActivity, type UserRole, addTeamMeeting, removeTeamMeeting, addClassroomVisit, removeClassroomVisit, addOtherActivity, removeOtherActivity, printForm } from './formStore';

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

describe('formStore (extended coverage)', () => {
  it('should add and remove a team meeting', async () => {
    addTeamMeeting();
    let formState = get(formStore);
    expect(formState.teamMeetings.length).toBe(2);
    removeTeamMeeting(0);
    await tick();
    formState = get(formStore);
    expect(formState.teamMeetings.length).toBe(1);
  });

  it('should add and remove a classroom visit', async () => {
    addClassroomVisit();
    let formState = get(formStore);
    expect(formState.classroomVisits.length).toBe(2);
    removeClassroomVisit(0);
    await tick();
    formState = get(formStore);
    expect(formState.classroomVisits.length).toBe(1);
  });

  it('should add and remove an other activity', async () => {
    addOtherActivity();
    let formState = get(formStore);
    expect(formState.otherActivities.length).toBe(2);
    removeOtherActivity(0);
    await tick();
    formState = get(formStore);
    expect(formState.otherActivities.length).toBe(1);
  });

  it('should call window.print when printForm is called', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    printForm();
    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });

  describe('saveForm error branches', () => {
    it('should log error if #json_clob is missing', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(null);
      saveForm();
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Could not find input element'));
      errorSpy.mockRestore();
      getElementByIdSpy.mockRestore();
    });
    it('should log error if #json_clob is not an HTMLInputElement', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      // Return a plain HTMLElement (not HTMLInputElement)
      const fakeElement = document.createElement('div');
      const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(fakeElement);
      saveForm();
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Could not find input element'));
      errorSpy.mockRestore();
      getElementByIdSpy.mockRestore();
    });
    it('should log error if parent form is missing', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      // Return an HTMLInputElement with closest returning null
      const input = document.createElement('input');
      (input as any).closest = vi.fn().mockReturnValue(null);
      const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(input);
      saveForm();
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Could not find parent form'));
      errorSpy.mockRestore();
      getElementByIdSpy.mockRestore();
    });
    it('should log error if form submission throws', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      // Return an HTMLInputElement with closest returning a real HTMLFormElement whose submit throws
      const input = document.createElement('input');
      const form = document.createElement('form');
      form.submit = vi.fn().mockImplementation(() => { throw new Error('submit error'); });
      (input as any).closest = vi.fn().mockReturnValue(form);
      const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(input);
      saveForm();
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error submitting form:'), expect.any(Error));
      errorSpy.mockRestore();
      getElementByIdSpy.mockRestore();
    });
  });

  it('should log error if setFormConfig is called with invalid config', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    setFormConfig({} as any);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid config passed to setFormConfig'), {});
    errorSpy.mockRestore();
  });
});