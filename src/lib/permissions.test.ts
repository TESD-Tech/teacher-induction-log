import { describe, it, expect } from 'vitest';
import { canEdit } from './permissions';

describe('canEdit permissions', () => {
  it('admin can edit everything', () => {
    expect(canEdit('admin', 'coverPage', 'inductee')).toBe(true);
    expect(canEdit('admin', 'signatures', 'signatures')).toBe(true);
    expect(canEdit('admin', 'summerAcademy', 'verification')).toBe(true);
  });

  it('mentor can edit initials and signatures, not other fields', () => {
    expect(canEdit('mentor', 'coverPage', 'inductee')).toBe(false);
    expect(canEdit('mentor', 'signatures', 'signatures')).toBe(true);
    expect(canEdit('mentor', 'summerAcademy', 'verification')).toBe(true);
    expect(canEdit('mentor', 'summerAcademy', 'dateYearOne')).toBe(false);
  });

  it('mentee can edit all except initials and signatures', () => {
    expect(canEdit('mentee', 'coverPage', 'inductee')).toBe(true);
    expect(canEdit('mentee', 'signatures', 'signatures')).toBe(false);
    expect(canEdit('mentee', 'summerAcademy', 'verification')).toBe(false);
    expect(canEdit('mentee', 'summerAcademy', 'dateYearOne')).toBe(true);
  });
});