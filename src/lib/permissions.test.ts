import { describe, it, expect } from 'vitest';
import { canEdit, type UserRole } from './permissions';

describe('Permissions', () => {
  describe('canEdit', () => {
    it('should allow admin to edit any field in any section', () => {
      const role: UserRole = 'admin';
      
      // Admin should be able to edit verification fields
      expect(canEdit(role, 'summerAcademy', 'verification')).toBe(true);
      
      // Admin should be able to edit non-verification fields
      expect(canEdit(role, 'summerAcademy', 'dateYearOne')).toBe(true);
      
      // Admin should be able to edit signature section
      expect(canEdit(role, 'signatures', 'mentorTeacher')).toBe(true);
    });
    
    it('should allow mentor to edit only verification fields and signatures section', () => {
      const role: UserRole = 'mentor';
      
      // Mentor should be able to edit verification fields
      expect(canEdit(role, 'summerAcademy', 'verification')).toBe(true);
      expect(canEdit(role, 'inductionSeminars', 'verification')).toBe(true);
      
      // Mentor should not be able to edit non-verification fields
      expect(canEdit(role, 'summerAcademy', 'dateYearOne')).toBe(false);
      expect(canEdit(role, 'inductionSeminars', 'topic')).toBe(false);
      
      // Mentor should be able to edit signature section
      expect(canEdit(role, 'signatures', 'mentorTeacher')).toBe(true);
      expect(canEdit(role, 'signatures', 'buildingPrincipal')).toBe(true);
    });
    
    it('should allow mentee to edit non-verification fields and non-signature sections', () => {
      const role: UserRole = 'mentee';
      
      // Mentee should not be able to edit verification fields
      expect(canEdit(role, 'summerAcademy', 'verification')).toBe(false);
      expect(canEdit(role, 'inductionSeminars', 'verification')).toBe(false);
      
      // Mentee should be able to edit non-verification fields
      expect(canEdit(role, 'summerAcademy', 'dateYearOne')).toBe(true);
      expect(canEdit(role, 'inductionSeminars', 'topic')).toBe(true);
      
      // Mentee should not be able to edit signature section
      expect(canEdit(role, 'signatures', 'mentorTeacher')).toBe(false);
      expect(canEdit(role, 'signatures', 'buildingPrincipal')).toBe(false);
    });
    
    it('should return false for invalid roles', () => {
      // @ts-expect-error Testing with invalid role
      expect(canEdit('invalid-role', 'summerAcademy', 'dateYearOne')).toBe(false);
    });
  });
});