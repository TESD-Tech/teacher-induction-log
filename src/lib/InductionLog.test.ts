import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { formStore, formConfigStore } from './stores/formStore';
import { sectionConfigs } from './config/sectionConfigs';

// Mock the GenericSection component
vi.mock('./components/sections/GenericSection.svelte', () => ({
  default: vi.fn()
}));

describe('InductionLog Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Reset the stores
    formStore.set({
      inductee: '',
      building: '',
      assignment: '',
      mentorTeacher: '',
      schoolYearOne: '',
      schoolYearTwo: '',
      summerAcademy: [
        { day: 'Day 1', dateYearOne: '', dateYearTwo: '', verification: '' },
        { day: 'Day 2', dateYearOne: '', dateYearTwo: '', verification: '' },
        { day: 'Day 3', dateYearOne: '', dateYearTwo: '', verification: '' }
      ],
      inductionSeminars: [
        { number: 1, topic: '', dateYearOne: '', dateYearTwo: '', verification: '' },
        { number: 2, topic: '', dateYearOne: '', dateYearTwo: '', verification: '' }
      ],
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
  });

  it('should have all required section configurations', () => {
    // Verify that all required sections are defined in sectionConfigs
    const sectionIds = sectionConfigs.map(config => config.id);
    
    expect(sectionIds).toContain('summerAcademy');
    expect(sectionIds).toContain('inductionSeminars');
    expect(sectionIds).toContain('mentorMeetings');
    expect(sectionIds).toContain('teamMeetings');
    expect(sectionIds).toContain('classroomVisits');
    expect(sectionIds).toContain('otherActivities');
  });

  it('should have the correct data structure in formStore', () => {
    const formData = get(formStore);
    
    // Check basic form fields
    expect(formData).toHaveProperty('inductee');
    expect(formData).toHaveProperty('building');
    expect(formData).toHaveProperty('assignment');
    expect(formData).toHaveProperty('mentorTeacher');
    expect(formData).toHaveProperty('schoolYearOne');
    expect(formData).toHaveProperty('schoolYearTwo');
    
    // Check section data
    expect(formData).toHaveProperty('summerAcademy');
    expect(Array.isArray(formData.summerAcademy)).toBe(true);
    expect(formData.summerAcademy.length).toBe(3);
    
    expect(formData).toHaveProperty('inductionSeminars');
    expect(Array.isArray(formData.inductionSeminars)).toBe(true);
    expect(formData.inductionSeminars.length).toBe(2);
    
    expect(formData).toHaveProperty('mentorMeetings');
    expect(Array.isArray(formData.mentorMeetings)).toBe(true);
    
    expect(formData).toHaveProperty('teamMeetings');
    expect(Array.isArray(formData.teamMeetings)).toBe(true);
    
    expect(formData).toHaveProperty('classroomVisits');
    expect(Array.isArray(formData.classroomVisits)).toBe(true);
    
    expect(formData).toHaveProperty('otherActivities');
    expect(Array.isArray(formData.otherActivities)).toBe(true);
    
    // Check signatures
    expect(formData).toHaveProperty('signatures');
    expect(formData.signatures).toHaveProperty('mentorTeacher');
    expect(formData.signatures).toHaveProperty('buildingPrincipal');
    expect(formData.signatures).toHaveProperty('superintendent');
    expect(formData.signatures).toHaveProperty('date');
  });

  it('should have the correct editability configuration', () => {
    const formConfig = get(formConfigStore);
    
    // Check user role
    expect(formConfig).toHaveProperty('userRole');
    expect(['admin', 'teacher']).toContain(formConfig.userRole);
    
    // Check editability
    expect(formConfig).toHaveProperty('editable');
    expect(formConfig.editable).toHaveProperty('inductee');
    expect(formConfig.editable).toHaveProperty('building');
    expect(formConfig.editable).toHaveProperty('assignment');
    expect(formConfig.editable).toHaveProperty('mentorTeacher');
    expect(formConfig.editable).toHaveProperty('schoolYearOne');
    expect(formConfig.editable).toHaveProperty('schoolYearTwo');
    expect(formConfig.editable).toHaveProperty('summerAcademy');
    expect(formConfig.editable).toHaveProperty('inductionSeminars');
    expect(formConfig.editable).toHaveProperty('mentorMeetings');
    expect(formConfig.editable).toHaveProperty('teamMeetings');
    expect(formConfig.editable).toHaveProperty('classroomVisits');
    expect(formConfig.editable).toHaveProperty('otherActivities');
    expect(formConfig.editable).toHaveProperty('signatures');
    
    // Check verification editability
    expect(formConfig.editable).toHaveProperty('verifications');
    expect(formConfig.editable.verifications).toHaveProperty('summerAcademy');
    expect(formConfig.editable.verifications).toHaveProperty('inductionSeminars');
    expect(formConfig.editable.verifications).toHaveProperty('mentorMeetings');
    expect(formConfig.editable.verifications).toHaveProperty('teamMeetings');
    expect(formConfig.editable.verifications).toHaveProperty('classroomVisits');
    expect(formConfig.editable.verifications).toHaveProperty('otherActivities');
  });

  it('should have matching section configurations and form data', () => {
    const formData = get(formStore);
    
    // For each section config, verify that there's a corresponding property in the form data
    sectionConfigs.forEach(config => {
      expect(formData).toHaveProperty(config.dataKey);
    });
  });
});
