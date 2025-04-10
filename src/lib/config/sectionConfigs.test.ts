import { describe, it, expect } from 'vitest';
import { config } from './sectionConfigs'; // Import the main config object

describe('sectionConfigs', () => {
  it('should have the correct number of section configurations', () => {
    expect(config.sectionConfigs.length).toBe(6); // We have 6 sections configured
  });

  it('should have all required sections', () => {
    const sectionIds = config.sectionConfigs.map(config => config.id);
    
    expect(sectionIds).toContain('summerAcademy');
    expect(sectionIds).toContain('inductionSeminars');
    expect(sectionIds).toContain('mentorMeetings');
    expect(sectionIds).toContain('teamMeetings');
    expect(sectionIds).toContain('classroomVisits');
    expect(sectionIds).toContain('otherActivities');
  });

  it('should have the correct structure for each section', () => {
    config.sectionConfigs.forEach(config => {
      // Each config should have these properties
      expect(config).toHaveProperty('id');
      expect(config).toHaveProperty('title');
      expect(config).toHaveProperty('dataKey');
      expect(config).toHaveProperty('headers');
      expect(config).toHaveProperty('fields');
      
      // Fields should be an array
      expect(Array.isArray(config.fields)).toBe(true);
      
      // Each field should have a type and key
      config.fields.forEach(field => {
        expect(field).toHaveProperty('type');
        expect(field).toHaveProperty('key');
      });
    });
  });

  it('should have action handlers for sections that need them', () => {
    // Sections that should have add/remove actions
    const sectionsWithActions = ['mentorMeetings', 'teamMeetings', 'classroomVisits', 'otherActivities'];
    
    config.sectionConfigs.forEach(config => {
      if (sectionsWithActions.includes(config.id)) {
        expect(config).toHaveProperty('actions');
        if (config.actions) {
          expect(config.actions).toHaveProperty('add');
          expect(config.actions).toHaveProperty('remove');
          if (config.actions.add) {
            expect(config.actions.add).toHaveProperty('handler');
            expect(config.actions.add).toHaveProperty('label');
          }
          if (config.actions.remove) {
            expect(config.actions.remove).toHaveProperty('handler');
            expect(config.actions.remove).toHaveProperty('confirmMessage');
          }
        }
      }
    });
  });

  it('should have static fields for sections that need them', () => {
    // Get the summer academy config
    const summerAcademyConfig = config.sectionConfigs.find(config => config.id === 'summerAcademy');
    expect(summerAcademyConfig).toBeDefined();
    
    if (summerAcademyConfig) {
      // Should have a static field for day
      const dayField = summerAcademyConfig.fields.find(field => field.key === 'day');
      expect(dayField).toBeDefined();
      if (dayField) {
        expect(dayField.type).toBe('static');
      }
    }
    
    // Get the induction seminars config
    const inductionSeminarsConfig = config.sectionConfigs.find(config => config.id === 'inductionSeminars');
    expect(inductionSeminarsConfig).toBeDefined();
    
    if (inductionSeminarsConfig) {
      // Should have a static field for number
      const numberField = inductionSeminarsConfig.fields.find(field => field.key === 'number');
      expect(numberField).toBeDefined();
      if (numberField) {
        expect(numberField.type).toBe('static');
      }
    }
  });

  it('should have verification fields for all sections', () => {
    config.sectionConfigs.forEach(config => {
      // Each config should have a verification field
      const verificationField = config.fields.find(field => field.key === 'verification');
      expect(verificationField).toBeDefined();
      if (verificationField) {
        expect(verificationField.type).toBe('verification');
      }
    });
  });
});

describe('schoolYears', () => {
  it('should generate 4 consecutive school years starting from last year', () => {
    const currentYear = new Date().getFullYear();
    const expectedYears = Array.from({ length: 4 }, (_, i) => {
      const startYear = currentYear - 1 + i;
      return `${startYear}-${startYear + 1}`;
    });

    // Import the generated schoolYears
    const { schoolYears } = config; // Access schoolYears from the imported config object

    expect(schoolYears.length).toBe(4);
    expect(schoolYears).toEqual(expectedYears);
  });
});
