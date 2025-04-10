import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { 
  formStore, 
  formConfigStore, 
  setFormConfig, 
  addMentorMeeting, 
  removeMentorMeeting,
  addTeamMeeting,
  removeTeamMeeting,
  addClassroomVisit,
  removeClassroomVisit,
  addOtherActivity,
  removeOtherActivity
} from './formStore';

describe('formStore', () => {
  beforeEach(() => {
    // Reset the stores before each test
    formStore.set({
      inductee: '',
      building: '',
      assignment: '',
      mentorTeacher: '',
      schoolYearOne: '',
      schoolYearTwo: '',
      summerAcademy: [
        { day: 'Day 1', dateYearOne: '', dateYearTwo: '', verification: '' },
        { day: 'Day 2', dateYearOne: '', dateYearTwo: '', verification: '' },
        { day: 'Day 3', dateYearOne: '', dateYearTwo: '', verification: '' }
      ],
      inductionSeminars: [
        { number: 1, topic: '', dateYearOne: '', dateYearTwo: '', verification: '' },
        { number: 2, topic: '', dateYearOne: '', dateYearTwo: '', verification: '' }
      ],
      mentorMeetings: [],
      teamMeetings: [],
      classroomVisits: [],
      otherActivities: [],
      signatures: {
        mentorTeacher: '',
        buildingPrincipal: '',
        superintendent: '',
        date: ''
      }
    });

    formConfigStore.set({
      userRole: 'mentor' as const,
      data: {} as any // Adding data property to satisfy type requirements
    });
  });

  describe('setFormConfig', () => {
    it('should update the form data and configuration', () => {
      const newConfig = {
        data: {
          inductee: 'John Doe',
          building: 'Main School',
          assignment: 'Math Teacher',
          mentorTeacher: 'Jane Smith',
          schoolYearOne: '2024-2025',
          schoolYearTwo: '2025-2026',
          summerAcademy: [
            { day: 'Day 1', dateYearOne: '2024-06-01', dateYearTwo: '', verification: 'ABC' }
          ],
          inductionSeminars: [],
          mentorMeetings: [],
          teamMeetings: [],
          classroomVisits: [],
          otherActivities: [],
          signatures: {
            mentorTeacher: '',
            buildingPrincipal: '',
            superintendent: '',
            date: ''
          }
        },
        userRole: 'mentor' as const
      };

      setFormConfig(newConfig);

      const formData = get(formStore);
      const formConfig = get(formConfigStore);

      expect(formData.inductee).toBe('John Doe');
      expect(formData.building).toBe('Main School');
      expect(formData.summerAcademy[0].dateYearOne).toBe('2024-06-01');
      expect(formData.summerAcademy[0].verification).toBe('ABC');

      expect(formConfig.userRole).toBe('mentor');
    });

    it('should set verification fields to be editable for admin users', () => {
      const adminConfig = {
        data: { 
          inductee: 'John Doe',
          building: '',
          assignment: '',
          mentorTeacher: '',
          schoolYearOne: '',
          schoolYearTwo: '',
          summerAcademy: [],
          inductionSeminars: [],
          mentorMeetings: [],
          teamMeetings: [],
          classroomVisits: [],
          otherActivities: [],
          signatures: {
            mentorTeacher: '',
            buildingPrincipal: '',
            superintendent: '',
            date: ''
          }
        },
        userRole: 'admin' as const
      };

      setFormConfig(adminConfig);

      const formConfig = get(formConfigStore);

      expect(formConfig.userRole).toBe('admin');
    });

    it('should set verification fields to be non-editable for teacher users', () => {
      const teacherConfig = {
        data: { 
          inductee: 'John Doe',
          building: '',
          assignment: '',
          mentorTeacher: '',
          schoolYearOne: '',
          schoolYearTwo: '',
          summerAcademy: [],
          inductionSeminars: [],
          mentorMeetings: [],
          teamMeetings: [],
          classroomVisits: [],
          otherActivities: [],
          signatures: {
            mentorTeacher: '',
            buildingPrincipal: '',
            superintendent: '',
            date: ''
          }
        },
        userRole: 'mentor' as const
      };

      setFormConfig(teacherConfig);

      const formConfig = get(formConfigStore);

      expect(formConfig.userRole).toBe('mentor');
    });
  });

  describe('Mentor Meetings', () => {
    it('should add a mentor meeting', () => {
      addMentorMeeting();
      
      const formData = get(formStore);
      expect(formData.mentorMeetings.length).toBe(1);
      expect(formData.mentorMeetings[0]).toEqual({
        date: '',
        topic: '',
        dateYearOne: '',
        dateYearTwo: '',
        verification: ''
      });
    });

    it('should remove a mentor meeting', () => {
      // Add two meetings
      addMentorMeeting();
      addMentorMeeting();
      
      // Set some data to the first one
      formStore.update(data => {
        data.mentorMeetings[0].topic = 'Test Meeting';
        return data;
      });
      
      // Remove the first meeting
      removeMentorMeeting(0);
      
      const formData = get(formStore);
      expect(formData.mentorMeetings.length).toBe(1);
      expect(formData.mentorMeetings[0].topic).toBe('');
    });
  });

  describe('Team Meetings', () => {
    it('should add a team meeting', () => {
      addTeamMeeting();
      
      const formData = get(formStore);
      expect(formData.teamMeetings.length).toBe(1);
      expect(formData.teamMeetings[0]).toEqual({
        date: '',
        topic: '',
        dateYearOne: '',
        dateYearTwo: '',
        verification: ''
      });
    });

    it('should remove a team meeting', () => {
      // Add two meetings
      addTeamMeeting();
      addTeamMeeting();
      
      // Set some data to the first one
      formStore.update(data => {
        data.teamMeetings[0].topic = 'Test Team Meeting';
        return data;
      });
      
      // Remove the first meeting
      removeTeamMeeting(0);
      
      const formData = get(formStore);
      expect(formData.teamMeetings.length).toBe(1);
      expect(formData.teamMeetings[0].topic).toBe('');
    });
  });

  describe('Classroom Visits', () => {
    it('should add a classroom visit', () => {
      addClassroomVisit();
      
      const formData = get(formStore);
      expect(formData.classroomVisits.length).toBe(1);
      expect(formData.classroomVisits[0]).toEqual({
        date: '',
        teacher: '',
        subject: '',
        dateYearOne: '',
        dateYearTwo: '',
        verification: ''
      });
    });

    it('should remove a classroom visit', () => {
      // Add two visits
      addClassroomVisit();
      addClassroomVisit();
      
      // Set some data to the first one
      formStore.update(data => {
        data.classroomVisits[0].teacher = 'Test Teacher';
        return data;
      });
      
      // Remove the first visit
      removeClassroomVisit(0);
      
      const formData = get(formStore);
      expect(formData.classroomVisits.length).toBe(1);
      expect(formData.classroomVisits[0].teacher).toBe('');
    });
  });

  describe('Other Activities', () => {
    it('should add an other activity', () => {
      addOtherActivity();
      
      const formData = get(formStore);
      expect(formData.otherActivities.length).toBe(1);
      expect(formData.otherActivities[0]).toEqual({
        date: '',
        activity: '',
        dateYearOne: '',
        dateYearTwo: '',
        verification: ''
      });
    });

    it('should remove an other activity', () => {
      // Add two activities
      addOtherActivity();
      addOtherActivity();
      
      // Set some data to the first one
      formStore.update(data => {
        data.otherActivities[0].activity = 'Test Activity';
        return data;
      });
      
      // Remove the first activity
      removeOtherActivity(0);
      
      const formData = get(formStore);
      expect(formData.otherActivities.length).toBe(1);
      expect(formData.otherActivities[0].activity).toBe('');
    });
  });
});
