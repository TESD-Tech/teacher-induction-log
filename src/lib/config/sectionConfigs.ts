import type { SummerAcademyDay, InductionSeminar, MentorMeeting, TeamMeeting, ClassroomVisit, OtherActivity } from '../stores/formStore';

// Define field types for the generic section
export type FieldType = 'text' | 'date' | 'verification' | 'static';

// Define a field configuration
export interface FieldConfig {
  type: FieldType;
  key: string;
  label?: string;
  placeholder?: string;
  readonly?: boolean;
}

// Define a section configuration
export interface SectionConfig {
  id: string;
  title: string;
  dataKey: string;
  headers: string[];
  columnWidths?: string[];
  fields: FieldConfig[];
  actions?: {
    add?: {
      handler: string;
      label: string;
    };
    remove?: {
      handler: string;
      confirmMessage: string;
    };
  };
}

// Define all section configurations
export const sectionConfigs: SectionConfig[] = [
  {
    id: 'summerAcademy',
    title: 'I. Summer Academy',
    dataKey: 'summerAcademy',
    headers: ['Activity', 'Date (Year 1)', 'Date (Year 2)', 'Verification'],
    columnWidths: ['25%', '25%', '25%', '25%'],
    fields: [
      { type: 'static', key: 'day' },
      { type: 'date', key: 'dateYearOne' },
      { type: 'date', key: 'dateYearTwo' },
      { type: 'verification', key: 'verification', placeholder: 'Mentor initials' }
    ],
    actions: {} // No actions for Summer Academy
  },
  {
    id: 'inductionSeminars',
    title: 'II. Induction Seminars',
    dataKey: 'inductionSeminars',
    headers: ['Number', 'Topic', 'Date (Year 1)', 'Date (Year 2)', 'Verification'],
    columnWidths: ['10%', '40%', '15%', '15%', '20%'],
    fields: [
      { type: 'static', key: 'number' },
      { type: 'text', key: 'topic' },
      { type: 'date', key: 'dateYearOne' },
      { type: 'date', key: 'dateYearTwo' },
      { type: 'verification', key: 'verification', placeholder: 'Mentor initials' }
    ],
    actions: {} // No actions for Induction Seminars
  },
  {
    id: 'mentorMeetings',
    title: 'III. Meetings with mentor teacher',
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
      remove: { handler: 'removeMentorMeeting', confirmMessage: 'Are you sure you want to remove this mentor meeting?' }
    }
  },
  {
    id: 'teamMeetings',
    title: 'IV. Induction team meetings',
    dataKey: 'teamMeetings',
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
      add: { handler: 'addTeamMeeting', label: 'Add Meeting' },
      remove: { handler: 'removeTeamMeeting', confirmMessage: 'Are you sure you want to remove this team meeting?' }
    }
  },
  {
    id: 'classroomVisits',
    title: 'V. Visits to other classrooms',
    dataKey: 'classroomVisits',
    headers: ['Date', 'Teacher', 'Subject', 'Date (Year 1)', 'Date (Year 2)', 'Verification'],
    columnWidths: ['10%', '15%', '15%', '10%', '10%', '15%', '15%'],
    fields: [
      { type: 'date', key: 'date' },
      { type: 'text', key: 'teacher' },
      { type: 'text', key: 'subject' },
      { type: 'date', key: 'dateYearOne' },
      { type: 'date', key: 'dateYearTwo' },
      { type: 'verification', key: 'verification', placeholder: 'Mentor initials' }
    ],
    actions: {
      add: { handler: 'addClassroomVisit', label: 'Add Visit' },
      remove: { handler: 'removeClassroomVisit', confirmMessage: 'Are you sure you want to remove this classroom visit?' }
    }
  },
  {
    id: 'otherActivities',
    title: 'VI. Other: conferences, courses, etc.',
    dataKey: 'otherActivities',
    headers: ['Date', 'Activity', 'Date (Year 1)', 'Date (Year 2)', 'Verification'],
    columnWidths: ['12%', '30%', '12%', '12%', '18%', '16%'],
    fields: [
      { type: 'date', key: 'date' },
      { type: 'text', key: 'activity' },
      { type: 'date', key: 'dateYearOne' },
      { type: 'date', key: 'dateYearTwo' },
      { type: 'verification', key: 'verification', placeholder: 'Mentor initials' }
    ],
    actions: {
      add: { handler: 'addOtherActivity', label: 'Add Activity' },
      remove: { handler: 'removeOtherActivity', confirmMessage: 'Are you sure you want to remove this activity?' }
    }
  }
];
