import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { formStore, formConfigStore } from './lib/stores/formStore';

// Mock the InductionLog component
vi.mock('./lib/InductionLog.svelte', () => ({
  default: vi.fn()
}));

describe('SvelteAppElement Custom Element', () => {
  let SvelteAppElement: any;
  const originalCreateElement = document.createElement;
  let mockCreateElement: any;
  
  beforeEach(async () => {
    vi.resetAllMocks();
    
    // Reset the stores
    formStore.set({
      inductee: '',
      building: '',
      assignment: '',
      mentorTeacher: '',
      schoolYearOne: '',
      schoolYearTwo: '',
      summerAcademy: [],
      inductionSeminars: [],
      mentorMeetings: [],
      teamMeetings: [],
      classroomVisits: [],
      otherActivities: [],
      signatures: {
        mentorTeacher: '',
        buildingPrincipal: '',
        superintendent: '',
        date: ''
      }
    });

    formConfigStore.set({
      userRole: 'teacher' as const,
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
        signatures: true,
        verifications: {
          summerAcademy: false,
          inductionSeminars: false,
          mentorMeetings: false,
          teamMeetings: false,
          classroomVisits: false,
          otherActivities: false
        }
      },
      data: {} as any
    });
    
    // Mock document.createElement
    mockCreateElement = vi.fn((...args) => originalCreateElement.apply(document, args));
    document.createElement = mockCreateElement;
    
    // Import the custom element module
    const customElementModule = await import('./custom-element');
    SvelteAppElement = customElementModule.SvelteAppElement;
  });
  
  afterEach(() => {
    // Restore original document.createElement
    document.createElement = originalCreateElement;
  });

  it('should define the custom element', () => {
    expect(SvelteAppElement).toBeDefined();
    expect(typeof SvelteAppElement).toBe('function');
  });

  it('should initialize with default configuration when no attributes are provided', () => {
    const element = new SvelteAppElement();
    const formConfig = get(formConfigStore);
    
    expect(formConfig.userRole).toBe('teacher');
    
    expect(formConfig.editable.verifications.summerAcademy).toBe(false);
    expect(formConfig.editable.verifications.inductionSeminars).toBe(false);
    expect(formConfig.editable.verifications.mentorMeetings).toBe(false);
    expect(formConfig.editable.verifications.teamMeetings).toBe(false);
    expect(formConfig.editable.verifications.classroomVisits).toBe(false);
    expect(formConfig.editable.verifications.otherActivities).toBe(false);
  });

  it('should update configuration when data is available', () => {
    const element = new SvelteAppElement();
    
    formStore.set({
      inductee: 'John Doe',
      building: 'Main School',
      assignment: 'Math Teacher',
      mentorTeacher: 'Jane Smith',
      schoolYearOne: '2024-2025',
      schoolYearTwo: '2025-2026',
      summerAcademy: [
        { day: 'Day 1', dateYearOne: '2024-06-01', dateYearTwo: '', verification: 'ABC' }
      ],
      inductionSeminars: [],
      mentorMeetings: [],
      teamMeetings: [],
      classroomVisits: [],
      otherActivities: [],
      signatures: {
        mentorTeacher: '',
        buildingPrincipal: '',
        superintendent: '',
        date: ''
      }
    });
    
    const formData = get(formStore);
    expect(formData.inductee).toBe('John Doe');
    expect(formData.building).toBe('Main School');
  });

  it('should handle JSON parsing errors gracefully', () => {
    const element = new SvelteAppElement();
    const consoleErrorSpy = vi.spyOn(console, 'error');
    
    element.setAttribute('data', '{invalid-json}');
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    const formData = get(formStore);
    expect(formData.inductee).toBe('');
  });

  it('should update editable configuration via attribute', () => {
    const element = new SvelteAppElement();
    
    const editableConfig = JSON.stringify({
      inductee: false,
      building: false,
      verifications: {
        summerAcademy: true,
        inductionSeminars: true
      }
    });
    
    element.setAttribute('editable', editableConfig);
    
    const formConfig = get(formConfigStore);
    expect(formConfig.editable.inductee).toBe(false);
    expect(formConfig.editable.building).toBe(false);
    expect(formConfig.editable.verifications.summerAcademy).toBe(true);
    expect(formConfig.editable.verifications.inductionSeminars).toBe(true);
  });

  it('should update user role via attribute', () => {
    const element = new SvelteAppElement();
    
    element.setAttribute('user-role', 'admin');
    
    const formConfig = get(formConfigStore);
    expect(formConfig.userRole).toBe('admin');
  });

  it('should handle multiple attribute updates', () => {
    const element = new SvelteAppElement();
    
    // First update data
    const data = JSON.stringify({
      inductee: 'Jane Smith',
      building: 'Secondary School'
    });
    element.setAttribute('data', data);
    
    // Then update editable configuration
    const editableConfig = JSON.stringify({
      inductee: false,
      building: false
    });
    element.setAttribute('editable', editableConfig);
    
    const formConfig = get(formConfigStore);
    const formData = get(formStore);
    
    expect(formData.inductee).toBe('Jane Smith');
    expect(formData.building).toBe('Secondary School');
    expect(formConfig.editable.inductee).toBe(false);
    expect(formConfig.editable.building).toBe(false);
  });
});