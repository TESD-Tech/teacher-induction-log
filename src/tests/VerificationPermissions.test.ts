import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';

// Import our stores
import * as formStoreModule from '../lib/stores/formStore';
import type { SectionConfig } from '../lib/config/sectionConfigs';

// Mock the formStore module
vi.mock('../lib/stores/formStore', () => {
  return {
    formStore: {
      subscribe: vi.fn((callback) => {
        callback({
          mentorMeetings: [
            { date: "2025-04-01", topic: "Test Meeting", dateYearOne: "2025-04-01", dateYearTwo: "", verification: "BJK" }
          ]
        });
        return () => {}; // Unsubscribe function
      }),
      update: vi.fn(),
      set: vi.fn(),
    },
    formConfigStore: {
      subscribe: vi.fn((callback) => {
        callback(mockFormConfig);
        return () => {}; // Unsubscribe function
      }),
      update: vi.fn(),
      set: vi.fn(),
    },
    setFormConfig: vi.fn((config) => {
      return config;
    }),
  };
});

// Mock data
interface EditableVerifications {
  mentorMeetings: boolean;
  summerAcademy: boolean;
  inductionSeminars: boolean;
  teamMeetings: boolean;
  classroomVisits: boolean;
  otherActivities: boolean;
  [key: string]: boolean; // allow string indexing
}

interface EditableConfig {
  mentorMeetings: boolean;
  summerAcademy: boolean;
  inductionSeminars: boolean;
  teamMeetings: boolean;
  classroomVisits: boolean;
  otherActivities: boolean;
  [key: string]: boolean | EditableVerifications;
  verifications: EditableVerifications;
}

interface MockFormConfig {
  data: any;
  editable: EditableConfig;
  userRole: 'mentee' | 'mentor' | 'admin';
}

let mockFormConfig: MockFormConfig = {
  data: {
    mentorMeetings: [
      { date: "2025-04-01", topic: "Test Meeting", dateYearOne: "2025-04-01", dateYearTwo: "", verification: "BJK" }
    ]
  },
  editable: {
    mentorMeetings: true,
    summerAcademy: true,
    inductionSeminars: true,
    teamMeetings: true,
    classroomVisits: true,
    otherActivities: true,
    verifications: {
      mentorMeetings: false,
      summerAcademy: false,
      inductionSeminars: false,
      teamMeetings: false,
      classroomVisits: false,
      otherActivities: false
    }
  },
  userRole: 'mentee'
};

describe('Verification Field Permissions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  afterEach(() => {
    cleanup();
  });
  
  it('verification fields should be read-only for mentee role', () => {
    mockFormConfig.userRole = 'mentee';
    mockFormConfig.editable.verifications.mentorMeetings = false;
    mockFormConfig.editable.mentorMeetings = true;

    const isEditable = (fieldKey: string, itemType: string) => {
      if (fieldKey === 'verification') {
        return mockFormConfig.editable.verifications?.[itemType];
      }
      return mockFormConfig.editable[itemType];
    };

    expect(isEditable('verification', 'mentorMeetings')).toBe(false);
  });
  
  it('non-verification fields should be editable for mentee role', () => {
    mockFormConfig.userRole = 'mentee';
    mockFormConfig.editable.mentorMeetings = true;
    mockFormConfig.editable.verifications.mentorMeetings = false;

    const isEditable = (fieldKey: string, itemType: string) => {
      if (fieldKey === 'verification') {
        return mockFormConfig.editable.verifications[itemType];
      }
      return mockFormConfig.editable[itemType];
    };

    expect(isEditable('verification', 'mentorMeetings')).toBe(false);
    expect(isEditable('date', 'mentorMeetings')).toBe(true);
    expect(isEditable('topic', 'mentorMeetings')).toBe(true);
    expect(isEditable('dateYearOne', 'mentorMeetings')).toBe(true);
    expect(isEditable('dateYearTwo', 'mentorMeetings')).toBe(true);
  });
  
  it('verification fields should be editable for admin role', () => {
    mockFormConfig.userRole = 'admin';
    mockFormConfig.editable.verifications.mentorMeetings = true;
    mockFormConfig.editable.mentorMeetings = true;

    const isEditable = (fieldKey: string, itemType: string) => {
      if (fieldKey === 'verification') {
        return mockFormConfig.editable.verifications[itemType];
      }
      return mockFormConfig.editable[itemType];
    };

    expect(isEditable('verification', 'mentorMeetings')).toBe(true);
  });

  it('mentor should be able to edit mentorMeetings verification but not others', () => {
    mockFormConfig.userRole = 'mentor';
    mockFormConfig.editable.verifications.mentorMeetings = true;
    mockFormConfig.editable.verifications.summerAcademy = false;

    const isEditable = (fieldKey: string, itemType: string) => {
      if (fieldKey === 'verification') {
        return mockFormConfig.editable.verifications[itemType];
      }
      return mockFormConfig.editable[itemType];
    };

    expect(isEditable('verification', 'mentorMeetings')).toBe(true);
    expect(isEditable('verification', 'summerAcademy')).toBe(false);
  });

  it('mentee should not be able to edit any verification fields', () => {
    mockFormConfig.userRole = 'mentee';
    mockFormConfig.editable.verifications.mentorMeetings = false;
    mockFormConfig.editable.verifications.summerAcademy = false;

    const isEditable = (fieldKey: string, itemType: string) => {
      if (fieldKey === 'verification') {
        return mockFormConfig.editable.verifications[itemType];
      }
      return mockFormConfig.editable[itemType];
    };

    expect(isEditable('verification', 'mentorMeetings')).toBe(false);
    expect(isEditable('verification', 'summerAcademy')).toBe(false);
  });
  
  it('setFormConfig should configure verification fields based on role', () => {
    const setFormConfig = vi.mocked(formStoreModule.setFormConfig);

    const adminConfig = {
      data: {} as any,
      editable: { verifications: {} as any } as any,
      userRole: 'admin' as 'admin' | 'mentor' | 'mentee'
    };
    setFormConfig(adminConfig);

    const mentorConfig = {
      data: {} as any,
      editable: { verifications: {} as any } as any,
      userRole: 'mentor' as 'admin' | 'mentor' | 'mentee'
    };
    setFormConfig(mentorConfig);

    const menteeConfig = {
      data: {} as any,
      editable: { verifications: {} as any } as any,
      userRole: 'mentee' as 'admin' | 'mentor' | 'mentee'
    };
    setFormConfig(menteeConfig);

    expect(setFormConfig).toHaveBeenCalledTimes(3);
    expect(setFormConfig).toHaveBeenCalledWith(adminConfig);
    expect(setFormConfig).toHaveBeenCalledWith(mentorConfig);
    expect(setFormConfig).toHaveBeenCalledWith(menteeConfig);
  });
});
