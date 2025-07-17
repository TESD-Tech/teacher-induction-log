// Test for JSON_CLOB parsing functionality
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseFormConfig, isJsonClobFormat, setFormConfig, formConfigStore, formStore } from './formStore';
import type { RawFormConfig, FormConfig, FormData, JsonClobEntry } from './formStore';
import { get } from 'svelte/store';

describe('JSON_CLOB Parsing', () => {
  beforeEach(() => {
    // Reset stores before each test
    setFormConfig({
      userRole: 'mentee',
      options: { mentors: [], buildings: [], assignments: [], schoolYears: [] },
      editable: {
        inductee: true, building: true, assignment: true, mentorTeacher: true,
        schoolYearOne: true, schoolYearTwo: true, summerAcademy: true,
        inductionSeminars: true, mentorMeetings: true, teamMeetings: true,
        classroomVisits: true, otherActivities: true, signatures: true
      },
      data: {
        inductee: '', building: '', assignment: '', mentorTeacher: '',
        schoolYearOne: '', schoolYearTwo: '',
        summerAcademy: [], inductionSeminars: [], mentorMeetings: [], 
        teamMeetings: [], classroomVisits: [], otherActivities: [],
        signatures: { mentorTeacher: '', buildingPrincipal: '', superintendent: '', date: '' }
      }
    });
  });

  describe('isJsonClobFormat', () => {
    it('should return true for JSON_CLOB array format', () => {
      const rawConfig: RawFormConfig = {
        userRole: 'mentee',
        options: { mentors: [], buildings: [], assignments: [], schoolYears: [] },
        editable: {
          inductee: true, building: true, assignment: true, mentorTeacher: true,
          schoolYearOne: true, schoolYearTwo: true, summerAcademy: true,
          inductionSeminars: true, mentorMeetings: true, teamMeetings: true,
          classroomVisits: true, otherActivities: true, signatures: true
        },
        data: [{ JSON_CLOB: '{"inductee":"Test"}' }]
      };

      expect(isJsonClobFormat(rawConfig)).toBe(true);
    });

    it('should return false for legacy format', () => {
      const rawConfig: RawFormConfig = {
        userRole: 'mentee',
        options: { mentors: [], buildings: [], assignments: [], schoolYears: [] },
        editable: {
          inductee: true, building: true, assignment: true, mentorTeacher: true,
          schoolYearOne: true, schoolYearTwo: true, summerAcademy: true,
          inductionSeminars: true, mentorMeetings: true, teamMeetings: true,
          classroomVisits: true, otherActivities: true, signatures: true
        },
        data: { inductee: 'Test', building: '', assignment: '', mentorTeacher: '', schoolYearOne: '', schoolYearTwo: '', summerAcademy: [], inductionSeminars: [], mentorMeetings: [], teamMeetings: [], classroomVisits: [], otherActivities: [], signatures: { mentorTeacher: '', buildingPrincipal: '', superintendent: '', date: '' } }
      };

      expect(isJsonClobFormat(rawConfig)).toBe(false);
    });

    it('should return false for empty array', () => {
      const rawConfig: RawFormConfig = {
        userRole: 'mentee',
        options: { mentors: [], buildings: [], assignments: [], schoolYears: [] },
        editable: {
          inductee: true, building: true, assignment: true, mentorTeacher: true,
          schoolYearOne: true, schoolYearTwo: true, summerAcademy: true,
          inductionSeminars: true, mentorMeetings: true, teamMeetings: true,
          classroomVisits: true, otherActivities: true, signatures: true
        },
        data: []
      };

      expect(isJsonClobFormat(rawConfig)).toBe(false);
    });
  });

  describe('parseFormConfig', () => {
    it('should parse JSON_CLOB format correctly', () => {
      const testFormData = {
        inductee: 'Esther Tester',
        building: 'Hillside Elementary School',
        assignment: 'Mathematics',
        mentorTeacher: 'Valerie Cunningham',
        schoolYearOne: '2024-2025',
        schoolYearTwo: '2025-2026',
        summerAcademy: [
          { day: 'Day 1', dateYearOne: '2024-08-15', dateYearTwo: '', verification: 'BJK' }
        ],
        inductionSeminars: [
          { number: 1, topic: 'Classroom Management', dateYearOne: '2024-09-10', dateYearTwo: '', verification: 'BJK' }
        ],
        mentorMeetings: [
          { date: '2024-09-05', topic: 'First Week Reflection', dateYearOne: '2024-09-05', dateYearTwo: '', verification: 'BJK' }
        ],
        teamMeetings: [
          { date: '2024-09-12', topic: 'Math Department Planning', dateYearOne: '2024-09-12', dateYearTwo: '', verification: 'BJK' }
        ],
        classroomVisits: [
          { date: '2024-09-20', teacher: 'Sarah Williams', subject: 'Algebra II', dateYearOne: '2024-09-20', dateYearTwo: '', verification: 'BJK' }
        ],
        otherActivities: [
          { date: '2024-09-25', activity: 'Math Club Supervision', dateYearOne: '2024-09-25', dateYearTwo: '', verification: 'BJK' }
        ],
        signatures: {
          mentorTeacher: '',
          buildingPrincipal: '',
          superintendent: '',
          date: '2025-04-17'
        }
      };

      const rawConfig: RawFormConfig = {
        userRole: 'mentee',
        options: {
          mentors: [{ name: 'Robert Johnson', dcid: 'Robert Johnson' }],
          buildings: [{ name: 'Edison Elementary', dcid: 'Edison Elementary' }],
          assignments: [{ name: '2nd Grade', dcid: '2nd Grade' }],
          schoolYears: [{ name: '2024-2025', dcid: '2024-2025' }]
        },
        editable: {
          inductee: true, building: true, assignment: true, mentorTeacher: true,
          schoolYearOne: true, schoolYearTwo: true, summerAcademy: true,
          inductionSeminars: true, mentorMeetings: true, teamMeetings: true,
          classroomVisits: true, otherActivities: true, signatures: true
        },
        data: [{ JSON_CLOB: JSON.stringify(testFormData) }]
      };

      const result = parseFormConfig(rawConfig);

      expect(result.userRole).toBe('mentee');
      expect(result.options).toEqual(rawConfig.options);
      expect(result.editable).toEqual(rawConfig.editable);
      expect(result.data.inductee).toBe('Esther Tester');
      expect(result.data.building).toBe('Hillside Elementary School');
      expect(result.data.assignment).toBe('Mathematics');
      expect(result.data.summerAcademy).toHaveLength(1);
      expect(result.data.summerAcademy[0].day).toBe('Day 1');
      expect(result.data.summerAcademy[0].initialsYearOne).toBe('BJK');
      expect(result.data.summerAcademy[0].initialsYearTwo).toBe('BJK');
    });

    it('should handle legacy format correctly', () => {
      const testFormData = {
        inductee: 'Legacy Test',
        building: 'Test School',
        assignment: 'Test Subject',
        mentorTeacher: 'Test Mentor',
        schoolYearOne: '2024-2025',
        schoolYearTwo: '2025-2026',
        summerAcademy: [],
        inductionSeminars: [],
        mentorMeetings: [],
        teamMeetings: [],
        classroomVisits: [],
        otherActivities: [],
        signatures: { mentorTeacher: '', buildingPrincipal: '', superintendent: '', date: '' }
      };

      const rawConfig: RawFormConfig = {
        userRole: 'admin',
        options: { mentors: [], buildings: [], assignments: [], schoolYears: [] },
        editable: {
          inductee: true, building: true, assignment: true, mentorTeacher: true,
          schoolYearOne: true, schoolYearTwo: true, summerAcademy: true,
          inductionSeminars: true, mentorMeetings: true, teamMeetings: true,
          classroomVisits: true, otherActivities: true, signatures: true
        },
        data: testFormData
      };

      const result = parseFormConfig(rawConfig);

      expect(result.userRole).toBe('admin');
      expect(result.data.inductee).toBe('Legacy Test');
      expect(result.data.building).toBe('Test School');
    });

    it('should handle invalid JSON_CLOB gracefully', () => {
      const rawConfig: RawFormConfig = {
        userRole: 'mentee',
        options: { mentors: [], buildings: [], assignments: [], schoolYears: [] },
        editable: {
          inductee: true, building: true, assignment: true, mentorTeacher: true,
          schoolYearOne: true, schoolYearTwo: true, summerAcademy: true,
          inductionSeminars: true, mentorMeetings: true, teamMeetings: true,
          classroomVisits: true, otherActivities: true, signatures: true
        },
        data: [{ JSON_CLOB: 'invalid json string' }]
      };

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = parseFormConfig(rawConfig);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error parsing JSON_CLOB'), expect.any(Error));
      expect(result.data.inductee).toBe(''); // Should fall back to initial data
      
      consoleSpy.mockRestore();
    });
  });

  describe('setFormConfig with JSON_CLOB', () => {
    it('should handle JSON_CLOB format in setFormConfig', () => {
      const testFormData = {
        inductee: 'Test JSON_CLOB User',
        building: 'JSON_CLOB School',
        assignment: 'JSON_CLOB Subject',
        mentorTeacher: 'JSON_CLOB Mentor',
        schoolYearOne: '2024-2025',
        schoolYearTwo: '2025-2026',
        summerAcademy: [
          { day: 'Day 1', dateYearOne: '2024-08-15', dateYearTwo: '', verification: 'TEST' }
        ],
        inductionSeminars: [],
        mentorMeetings: [],
        teamMeetings: [],
        classroomVisits: [],
        otherActivities: [],
        signatures: { mentorTeacher: '', buildingPrincipal: '', superintendent: '', date: '' }
      };

      const rawConfig: RawFormConfig = {
        userRole: 'mentor',
        options: {
          mentors: [{ name: 'Test Mentor', dcid: 'test-mentor' }],
          buildings: [],
          assignments: [],
          schoolYears: []
        },
        editable: {
          inductee: false, building: false, assignment: false, mentorTeacher: false,
          schoolYearOne: false, schoolYearTwo: false, summerAcademy: true,
          inductionSeminars: true, mentorMeetings: true, teamMeetings: true,
          classroomVisits: true, otherActivities: true, signatures: true
        },
        data: [{ JSON_CLOB: JSON.stringify(testFormData) }]
      };

      setFormConfig(rawConfig);

      const configStoreValue = get(formConfigStore);
      const formStoreValue = get(formStore);

      expect(configStoreValue.userRole).toBe('mentor');
      expect(configStoreValue.data.inductee).toBe('Test JSON_CLOB User');
      expect(formStoreValue.inductee).toBe('Test JSON_CLOB User');
      expect(formStoreValue.building).toBe('JSON_CLOB School');
      expect(formStoreValue.summerAcademy).toHaveLength(1);
      expect(formStoreValue.summerAcademy[0].initialsYearOne).toBe('TEST');
      expect(formStoreValue.summerAcademy[0].initialsYearTwo).toBe('TEST');
    });

    it('should handle legacy format in setFormConfig', () => {
      const legacyConfig: FormConfig = {
        userRole: 'admin',
        options: { mentors: [], buildings: [], assignments: [], schoolYears: [] },
        editable: {
          inductee: true, building: true, assignment: true, mentorTeacher: true,
          schoolYearOne: true, schoolYearTwo: true, summerAcademy: true,
          inductionSeminars: true, mentorMeetings: true, teamMeetings: true,
          classroomVisits: true, otherActivities: true, signatures: true
        },
        data: {
          inductee: 'Legacy User',
          building: 'Legacy School',
          assignment: 'Legacy Subject',
          mentorTeacher: 'Legacy Mentor',
          schoolYearOne: '2024-2025',
          schoolYearTwo: '2025-2026',
          summerAcademy: [],
          inductionSeminars: [],
          mentorMeetings: [],
          teamMeetings: [],
          classroomVisits: [],
          otherActivities: [],
          signatures: { mentorTeacher: '', buildingPrincipal: '', superintendent: '', date: '' }
        }
      };

      setFormConfig(legacyConfig);

      const configStoreValue = get(formConfigStore);
      const formStoreValue = get(formStore);

      expect(configStoreValue.userRole).toBe('admin');
      expect(formStoreValue.inductee).toBe('Legacy User');
      expect(formStoreValue.building).toBe('Legacy School');
    });
  });
});
