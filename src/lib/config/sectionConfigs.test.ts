import { describe, it, expect } from 'vitest';
import { sectionConfigs } from './sectionConfigs';
import type { FieldType, FieldConfig, SectionConfig } from './sectionConfigs';

describe('sectionConfigs.ts', () => {
  describe('sectionConfigs array', () => {
    it('exports an array of section configurations', () => {
      expect(Array.isArray(sectionConfigs)).toBe(true);
      expect(sectionConfigs.length).toBeGreaterThan(0);
    });

    it('contains all expected sections', () => {
      const sectionIds = sectionConfigs.map(config => config.id);
      
      expect(sectionIds).toContain('summerAcademy');
      expect(sectionIds).toContain('inductionSeminars');
      expect(sectionIds).toContain('mentorMeetings');
      expect(sectionIds).toContain('teamMeetings');
      expect(sectionIds).toContain('classroomVisits');
      expect(sectionIds).toContain('otherActivities');
    });

    it('has exactly 6 sections', () => {
      expect(sectionConfigs).toHaveLength(6);
    });
  });

  describe('individual section configurations', () => {
    it('all sections have required properties', () => {
      sectionConfigs.forEach(config => {
        expect(config).toHaveProperty('id');
        expect(config).toHaveProperty('title');
        expect(config).toHaveProperty('dataKey');
        expect(config).toHaveProperty('headers');
        expect(config).toHaveProperty('fields');
        
        expect(typeof config.id).toBe('string');
        expect(typeof config.title).toBe('string');
        expect(typeof config.dataKey).toBe('string');
        expect(Array.isArray(config.headers)).toBe(true);
        expect(Array.isArray(config.fields)).toBe(true);
      });
    });

    it('all fields have valid configurations', () => {
      const validFieldTypes: FieldType[] = ['text', 'date', 'verification', 'static'];
      
      sectionConfigs.forEach(section => {
        section.fields.forEach(field => {
          expect(field).toHaveProperty('type');
          expect(field).toHaveProperty('key');
          expect(validFieldTypes).toContain(field.type);
          expect(typeof field.key).toBe('string');
          expect(field.key.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Summer Academy section', () => {
    const summerAcademy = sectionConfigs.find(s => s.id === 'summerAcademy')!;

    it('has correct configuration', () => {
      expect(summerAcademy.title).toBe('I. Summer Academy');
      expect(summerAcademy.dataKey).toBe('summerAcademy');
      expect(summerAcademy.headers).toEqual(['Activity', 'Date (Year 1)', 'Date (Year 2)', 'Verification']);
    });

    it('has no actions (not dynamically editable)', () => {
      expect(summerAcademy.actions).toEqual({});
    });

    it('has correct field types', () => {
      expect(summerAcademy.fields[0].type).toBe('static'); // day
      expect(summerAcademy.fields[1].type).toBe('date'); // dateYearOne
      expect(summerAcademy.fields[2].type).toBe('date'); // dateYearTwo
      expect(summerAcademy.fields[3].type).toBe('verification'); // verification
    });
  });

  describe('sections with actions', () => {
    const sectionsWithActions = sectionConfigs.filter(s => s.actions?.add || s.actions?.remove);

    it('includes mentor meetings, team meetings, classroom visits, and other activities', () => {
      const idsWithActions = sectionsWithActions.map(s => s.id);
      expect(idsWithActions).toContain('mentorMeetings');
      expect(idsWithActions).toContain('teamMeetings');
      expect(idsWithActions).toContain('classroomVisits');
      expect(idsWithActions).toContain('otherActivities');
    });

    it('all actionable sections have both add and remove actions', () => {
      sectionsWithActions.forEach(section => {
        expect(section.actions?.add).toBeDefined();
        expect(section.actions?.remove).toBeDefined();
        expect(section.actions!.add!.handler).toBeTruthy();
        expect(section.actions!.add!.label).toBeTruthy();
        expect(section.actions!.remove!.handler).toBeTruthy();
        expect(section.actions!.remove!.confirmMessage).toBeTruthy();
      });
    });
  });

  describe('field type validation', () => {
    it('verification fields always have correct placeholder', () => {
      sectionConfigs.forEach(section => {
        section.fields.forEach(field => {
          if (field.type === 'verification') {
            expect(field.placeholder).toBe('Initials');
          }
        });
      });
    });

    it('static fields represent non-editable data', () => {
      const staticFields = sectionConfigs.flatMap(s => s.fields.filter(f => f.type === 'static'));
      expect(staticFields.length).toBeGreaterThan(0);
      
      // Summer Academy should have static 'day' field
      const summerFields = sectionConfigs.find(s => s.id === 'summerAcademy')?.fields || [];
      const dayField = summerFields.find(f => f.key === 'day');
      expect(dayField?.type).toBe('static');
    });
  });
});
