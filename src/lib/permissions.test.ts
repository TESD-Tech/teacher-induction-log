import { describe, it, expect } from 'vitest';
import { canEdit } from './permissions';
import type { UserRole } from './permissions';

describe('permissions.ts', () => {
  describe('canEdit function', () => {
    describe('admin role', () => {
      it('allows editing all sections and fields', () => {
        expect(canEdit('admin', 'any-section', 'any-field')).toBe(true);
        expect(canEdit('admin', 'signatures', 'verification')).toBe(true);
        expect(canEdit('admin', 'summerAcademy', 'date')).toBe(true);
        expect(canEdit('admin', 'mentorMeetings', 'topic')).toBe(true);
      });
    });

    describe('mentor role', () => {
      it('allows editing verification fields', () => {
        expect(canEdit('mentor', 'summerAcademy', 'verification')).toBe(true);
        expect(canEdit('mentor', 'inductionSeminars', 'verification')).toBe(true);
        expect(canEdit('mentor', 'mentorMeetings', 'verification')).toBe(true);
      });

      it('allows editing signatures section', () => {
        expect(canEdit('mentor', 'signatures', 'mentorTeacher')).toBe(true);
        expect(canEdit('mentor', 'signatures', 'buildingPrincipal')).toBe(true);
        expect(canEdit('mentor', 'signatures', 'date')).toBe(true);
      });

      it('denies editing other fields', () => {
        expect(canEdit('mentor', 'summerAcademy', 'date')).toBe(false);
        expect(canEdit('mentor', 'inductionSeminars', 'topic')).toBe(false);
        expect(canEdit('mentor', 'mentorMeetings', 'topic')).toBe(false);
        expect(canEdit('mentor', 'coverPage', 'inductee')).toBe(false);
      });
    });

    describe('mentee role', () => {
      it('allows editing non-verification fields', () => {
        expect(canEdit('mentee', 'summerAcademy', 'date')).toBe(true);
        expect(canEdit('mentee', 'inductionSeminars', 'topic')).toBe(true);
        expect(canEdit('mentee', 'mentorMeetings', 'topic')).toBe(true);
        expect(canEdit('mentee', 'coverPage', 'inductee')).toBe(true);
      });

      it('denies editing verification fields', () => {
        expect(canEdit('mentee', 'summerAcademy', 'verification')).toBe(false);
        expect(canEdit('mentee', 'inductionSeminars', 'verification')).toBe(false);
        expect(canEdit('mentee', 'mentorMeetings', 'verification')).toBe(false);
      });

      it('denies editing signatures section', () => {
        expect(canEdit('mentee', 'signatures', 'mentorTeacher')).toBe(false);
        expect(canEdit('mentee', 'signatures', 'buildingPrincipal')).toBe(false);
        expect(canEdit('mentee', 'signatures', 'date')).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('returns false for invalid roles', () => {
        expect(canEdit('invalid' as UserRole, 'any-section', 'any-field')).toBe(false);
        expect(canEdit('' as UserRole, 'signatures', 'verification')).toBe(false);
      });

      it('handles empty section and field strings', () => {
        expect(canEdit('admin', '', '')).toBe(true);
        expect(canEdit('mentor', '', 'verification')).toBe(true);
        expect(canEdit('mentor', 'signatures', '')).toBe(true);
        expect(canEdit('mentee', '', '')).toBe(true);
      });
    });
  });
});
