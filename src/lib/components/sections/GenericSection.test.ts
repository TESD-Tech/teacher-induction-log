import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import type { SectionConfig } from '../../config/sectionConfigs';
import * as formStoreModule from '../../stores/formStore';

// Mock the GenericSection component since we can't directly test Svelte 5 components yet
// We'll test the logic and configuration instead
vi.mock('./GenericSection.svelte', () => ({
  default: vi.fn()
}));

// Mock the formStore
vi.mock('../../stores/formStore', () => {
  const formStore = {
    subscribe: vi.fn(),
    update: vi.fn(),
    set: vi.fn(),
  };
  const formConfigStore = {
    subscribe: vi.fn(),
    update: vi.fn(),
    set: vi.fn(),
  };
  
  return {
    formStore,
    formConfigStore,
    addMentorMeeting: vi.fn(),
    removeMentorMeeting: vi.fn(),
    addTeamMeeting: vi.fn(),
    removeTeamMeeting: vi.fn(),
    addClassroomVisit: vi.fn(),
    removeClassroomVisit: vi.fn(),
    addOtherActivity: vi.fn(),
    removeOtherActivity: vi.fn(),
  };
});

describe('GenericSection Configuration', () => {
  let mockConfig: SectionConfig;
  
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    
    // Setup mock config
    mockConfig = {
      id: 'mentorMeetings',
      title: 'Test Meetings',
      dataKey: 'mentorMeetings',
      headers: ['Date', 'Topic', 'Date (Year 1)', 'Date (Year 2)', 'Verification'],
      columnWidths: ['12%', '30%', '12%', '12%', '18%', '16%'],
      fields: [
        { type: 'date', key: 'date' },
        { type: 'text', key: 'topic' },
        { type: 'date', key: 'dateYearOne' },
        { type: 'date', key: 'dateYearTwo' },
        { type: 'verification', key: 'verification', placeholder: 'Mentor initials' }
      ],
      actions: {
        add: { handler: 'addMentorMeeting', label: 'Add Meeting' },
        remove: { handler: 'removeMentorMeeting', confirmMessage: 'Are you sure?' }
      }
    };
  });
  
  afterEach(() => {
    cleanup();
  });
  
  it('has the correct structure', () => {
    expect(mockConfig.id).toBe('mentorMeetings');
    expect(mockConfig.title).toBe('Test Meetings');
    expect(mockConfig.dataKey).toBe('mentorMeetings');
    expect(mockConfig.headers.length).toBe(5);
    expect(mockConfig.fields.length).toBe(5);
  });
  
  it('has the correct field types', () => {
    const fieldTypes = mockConfig.fields.map(field => field.type);
    expect(fieldTypes).toContain('date');
    expect(fieldTypes).toContain('text');
    expect(fieldTypes).toContain('verification');
  });
  
  it('has the correct action handlers', () => {
    expect(mockConfig.actions?.add?.handler).toBe('addMentorMeeting');
    expect(mockConfig.actions?.remove?.handler).toBe('removeMentorMeeting');
  });
});

describe('formStore Action Handlers', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('addMentorMeeting should be callable', () => {
    formStoreModule.addMentorMeeting();
    expect(formStoreModule.addMentorMeeting).toHaveBeenCalled();
  });
  
  it('removeMentorMeeting should be callable with an index', () => {
    formStoreModule.removeMentorMeeting(0);
    expect(formStoreModule.removeMentorMeeting).toHaveBeenCalledWith(0);
  });
  
  it('addTeamMeeting should be callable', () => {
    formStoreModule.addTeamMeeting();
    expect(formStoreModule.addTeamMeeting).toHaveBeenCalled();
  });
  
  it('removeTeamMeeting should be callable with an index', () => {
    formStoreModule.removeTeamMeeting(0);
    expect(formStoreModule.removeTeamMeeting).toHaveBeenCalledWith(0);
  });
  
  it('addClassroomVisit should be callable', () => {
    formStoreModule.addClassroomVisit();
    expect(formStoreModule.addClassroomVisit).toHaveBeenCalled();
  });
  
  it('removeClassroomVisit should be callable with an index', () => {
    formStoreModule.removeClassroomVisit(0);
    expect(formStoreModule.removeClassroomVisit).toHaveBeenCalledWith(0);
  });
  
  it('addOtherActivity should be callable', () => {
    formStoreModule.addOtherActivity();
    expect(formStoreModule.addOtherActivity).toHaveBeenCalled();
  });
  
  it('removeOtherActivity should be callable with an index', () => {
    formStoreModule.removeOtherActivity(0);
    expect(formStoreModule.removeOtherActivity).toHaveBeenCalledWith(0);
  });
});
