import { describe, it, expect, vi } from 'vitest';
import * as mainModule from './main';
import App from './App.svelte';
import { mount as svelteMount } from 'svelte';

vi.mock('svelte', async () => {
  const actual = await vi.importActual<any>('svelte');
  return {
    ...actual,
    mount: vi.fn()
  };
});
describe('main module', () => {
  it('should export a mount function', () => {
    expect(mainModule.mount).toBeDefined();
    expect(typeof mainModule.mount).toBe('function');
  });

  it('should call svelte mount with correct parameters', () => {
    const mockContainer = document.createElement('div');
    const mockConfig = {
      sections: [],
      version: '1.0',
      data: {
        inductee: '',
        building: '',
        assignment: '',
        mentorTeacher: '',
        mentorNames: [],
        schoolYearOne: '',
        schoolYearTwo: '',
        activities: [],
        signatures: {
          mentorTeacher: '',
          buildingPrincipal: '',
          superintendent: '',
          date: ''
        },
        verificationNotes: [],
        lastSaved: '',
        status: '',
        id: '',
        summerAcademy: [],
        inductionSeminars: [],
        mentorMeetings: [],
        teamMeetings: [],
        observations: [],
        otherActivities: [],
        classroomVisits: []
      },
      userRole: 'mentee'
    };

    mainModule.mount(mockContainer, mockConfig);

    expect(svelteMount).toHaveBeenCalledWith(App, {
      target: mockContainer,
      props: {
        formConfig: mockConfig
      }
    });
  });

});
