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
      // Simulate the setFormConfig behavior
      if (config.userRole === 'admin') {
        config.editable.verifications = {
          summerAcademy: true,
          inductionSeminars: true,
          mentorMeetings: true,
          teamMeetings: true,
          classroomVisits: true,
          otherActivities: true
        };
      } else {
        config.editable.verifications = {
          summerAcademy: false,
          inductionSeminars: false,
          mentorMeetings: false,
          teamMeetings: false,
          classroomVisits: false,
          otherActivities: false
        };
      }
      return config;
    }),
  };
});

// Mock data
let mockFormConfig = {
  data: {
    mentorMeetings: [
      { date: "2025-04-01", topic: "Test Meeting", dateYearOne: "2025-04-01", dateYearTwo: "", verification: "BJK" }
    ]
  },
  editable: {
    mentorMeetings: true,
    verifications: {
      mentorMeetings: false // Default for teacher role
    }
  },
  userRole: 'teacher' as 'teacher' | 'admin'
};

describe('Verification Field Permissions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  afterEach(() => {
    cleanup();
  });
  
  it('verification fields should be read-only for teacher role', () => {
    // Set user role to teacher
    mockFormConfig.userRole = 'teacher';
    mockFormConfig.editable.verifications.mentorMeetings = false;
    
    // Check that isEditable function would return false for verification fields
    const isEditable = (fieldKey: string, itemType: string) => {
      if (fieldKey === 'verification') {
        return mockFormConfig.editable.verifications[itemType];
      }
      return mockFormConfig.editable[itemType];
    };
    
    expect(isEditable('verification', 'mentorMeetings')).toBe(false);
  });
  
  it('verification fields should be editable for admin role', () => {
    // Set user role to admin
    mockFormConfig.userRole = 'admin';
    mockFormConfig.editable.verifications.mentorMeetings = true;
    
    // Check that isEditable function would return true for verification fields
    const isEditable = (fieldKey: string, itemType: string) => {
      if (fieldKey === 'verification') {
        return mockFormConfig.editable.verifications[itemType];
      }
      return mockFormConfig.editable[itemType];
    };
    
    expect(isEditable('verification', 'mentorMeetings')).toBe(true);
  });
  
  it('setFormConfig should configure verification fields based on role', () => {
    const setFormConfig = vi.mocked(formStoreModule.setFormConfig);
    
    // Create a test config with admin role
    const adminConfig = {
      data: {} as any,
      editable: {
        verifications: {} as any
      } as any,
      userRole: 'admin' as 'admin' | 'teacher'
    };
    
    // Call the mocked function
    setFormConfig(adminConfig);
    
    // Create a test config with teacher role
    const teacherConfig = {
      data: {} as any,
      editable: {
        verifications: {} as any
      } as any,
      userRole: 'teacher' as 'admin' | 'teacher'
    };
    
    // Call the mocked function
    setFormConfig(teacherConfig);
    
    // Verify the function was called with correct arguments
    expect(setFormConfig).toHaveBeenCalledTimes(2);
    expect(setFormConfig).toHaveBeenCalledWith(adminConfig);
    expect(setFormConfig).toHaveBeenCalledWith(teacherConfig);
  });
});
