import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { formStore, formConfigStore } from './lib/stores/formStore';

// Mock the InductionLog component
vi.mock('./lib/InductionLog.svelte', () => ({
  default: vi.fn()
}));

// Mock the document.createElement to track custom element creation
const originalCreateElement = document.createElement;

describe('TeacherInductionLog Custom Element', () => {
  let TeacherInductionLog: any;
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
    TeacherInductionLog = customElementModule.TeacherInductionLog;
  });
  
  afterEach(() => {
    // Restore original document.createElement
    document.createElement = originalCreateElement;
  });

  it('should define the custom element', () => {
    expect(TeacherInductionLog).toBeDefined();
    expect(typeof TeacherInductionLog).toBe('function');
  });

  it('should initialize with default configuration when no attributes are provided', () => {
    // Create an instance of the custom element
    const element = new TeacherInductionLog();
    
    // Check the form config store
    const formConfig = get(formConfigStore);
    expect(formConfig.userRole).toBe('admin');
    
    // Verify editable properties for admin
    expect(formConfig.editable.verifications.summerAcademy).toBe(true);
    expect(formConfig.editable.verifications.inductionSeminars).toBe(true);
    expect(formConfig.editable.verifications.mentorMeetings).toBe(true);
    expect(formConfig.editable.verifications.teamMeetings).toBe(true);
    expect(formConfig.editable.verifications.classroomVisits).toBe(true);
    expect(formConfig.editable.verifications.otherActivities).toBe(true);
  });

  it('should update configuration when attributes are set', () => {
    // Create an instance of the custom element
    const element = new TeacherInductionLog();
    
    // Create test data
    const testData = {
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
    };
    
    const testEditable = {
      inductee: false,
      building: false,
      assignment: false,
      mentorTeacher: false,
      schoolYearOne: false,
      schoolYearTwo: false,
      summerAcademy: false,
      inductionSeminars: false,
      mentorMeetings: false,
      teamMeetings: false,
      classroomVisits: false,
      otherActivities: false,
      signatures: false,
      verifications: {
        summerAcademy: false,
        inductionSeminars: false,
        mentorMeetings: false,
        teamMeetings: false,
        classroomVisits: false,
        otherActivities: false
      }
    };
    
    // Set attributes
    element.setAttribute('data', JSON.stringify(testData));
    element.setAttribute('editable', JSON.stringify(testEditable));
    element.setAttribute('user-role', 'teacher');
    
    // Check if the form store was updated
    const formData = get(formStore);
    expect(formData.inductee).toBe('John Doe');
    expect(formData.building).toBe('Main School');
    
    // Check if the form config store was updated
    const formConfig = get(formConfigStore);
    expect(formConfig.userRole).toBe('teacher');
    expect(formConfig.editable.inductee).toBe(false);
    expect(formConfig.editable.building).toBe(false);
    
    // Verify verification fields are not editable for teacher
    expect(formConfig.editable.verifications.summerAcademy).toBe(false);
    expect(formConfig.editable.verifications.inductionSeminars).toBe(false);
    expect(formConfig.editable.verifications.mentorMeetings).toBe(false);
    expect(formConfig.editable.verifications.teamMeetings).toBe(false);
    expect(formConfig.editable.verifications.classroomVisits).toBe(false);
    expect(formConfig.editable.verifications.otherActivities).toBe(false);
  });

  it('should handle JSON parsing errors gracefully', () => {
    // Create an instance of the custom element
    const element = new TeacherInductionLog();
    
    // Set invalid JSON data
    element.setAttribute('data', '{invalid-json}');
    
    // The form store should not be affected by invalid JSON
    const formData = get(formStore);
    expect(formData.inductee).toBe('');
  });
});
