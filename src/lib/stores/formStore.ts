import { writable } from 'svelte/store';

// Define types for our form data
export interface SummerAcademyDay {
  day: string;
  dateYearOne: string;
  dateYearTwo: string;
  verification: string;
}

export interface InductionSeminar {
  number: number;
  topic: string;
  dateYearOne: string;
  dateYearTwo: string;
  verification: string;
}

export interface MentorMeeting {
  date: string;
  topic: string;
  dateYearOne: string;
  dateYearTwo: string;
  verification: string;
}

export interface TeamMeeting {
  date: string;
  topic: string;
  dateYearOne: string;
  dateYearTwo: string;
  verification: string;
}

export interface ClassroomVisit {
  date: string;
  teacher: string;
  subject: string;
  dateYearOne: string;
  dateYearTwo: string;
  verification: string;
}

export interface OtherActivity {
  date: string;
  activity: string;
  dateYearOne: string;
  dateYearTwo: string;
  verification: string;
}

export interface Signatures {
  mentorTeacher: string;
  buildingPrincipal: string;
  superintendent: string;
  date: string;
}

export interface FormData {
  inductee: string;
  building: string;
  assignment: string;
  mentorTeacher: string;
  schoolYearOne: string;
  schoolYearTwo: string;
  summerAcademy: SummerAcademyDay[];
  inductionSeminars: InductionSeminar[];
  mentorMeetings: MentorMeeting[];
  teamMeetings: TeamMeeting[];
  classroomVisits: ClassroomVisit[];
  otherActivities: OtherActivity[];
  signatures: Signatures;
}

// Initial form data
const initialFormData: FormData = {
  inductee: "",
  building: "",
  assignment: "",
  mentorTeacher: "",
  schoolYearOne: "",
  schoolYearTwo: "",
  summerAcademy: [
    { day: "Day 1", dateYearOne: "", dateYearTwo: "", verification: "" },
    { day: "Day 2", dateYearOne: "", dateYearTwo: "", verification: "" },
    { day: "Day 3", dateYearOne: "", dateYearTwo: "", verification: "" },
    { day: "Day 4", dateYearOne: "", dateYearTwo: "", verification: "" }
  ],
  inductionSeminars: [
    { number: 1, topic: "", dateYearOne: "", dateYearTwo: "", verification: "" },
    { number: 2, topic: "", dateYearOne: "", dateYearTwo: "", verification: "" },
    { number: 3, topic: "", dateYearOne: "", dateYearTwo: "", verification: "" },
    { number: 4, topic: "", dateYearOne: "", dateYearTwo: "", verification: "" }
  ],
  mentorMeetings: [
    { date: "", topic: "", dateYearOne: "", dateYearTwo: "", verification: "" }
  ],
  teamMeetings: [
    { date: "", topic: "", dateYearOne: "", dateYearTwo: "", verification: "" }
  ],
  classroomVisits: [
    { date: "", teacher: "", subject: "", dateYearOne: "", dateYearTwo: "", verification: "" }
  ],
  otherActivities: [
    { date: "", activity: "", dateYearOne: "", dateYearTwo: "", verification: "" }
  ],
  signatures: {
    mentorTeacher: "",
    buildingPrincipal: "",
    superintendent: "",
    date: ""
  }
};

// Create the store
export const formStore = writable<FormData>(initialFormData);

// Helper functions to update the store
export function addMentorMeeting() {
  formStore.update(data => {
    return {
      ...data,
      mentorMeetings: [...data.mentorMeetings, { date: "", topic: "", dateYearOne: "", dateYearTwo: "", verification: "" }]
    };
  });
}

export function removeMentorMeeting(index: number) {
  formStore.update(data => {
    return {
      ...data,
      mentorMeetings: data.mentorMeetings.filter((_, i) => i !== index)
    };
  });
}

export function addTeamMeeting() {
  formStore.update(data => {
    return {
      ...data,
      teamMeetings: [...data.teamMeetings, { date: "", topic: "", dateYearOne: "", dateYearTwo: "", verification: "" }]
    };
  });
}

export function removeTeamMeeting(index: number) {
  formStore.update(data => {
    return {
      ...data,
      teamMeetings: data.teamMeetings.filter((_, i) => i !== index)
    };
  });
}

export function addClassroomVisit() {
  formStore.update(data => {
    return {
      ...data,
      classroomVisits: [...data.classroomVisits, { date: "", teacher: "", subject: "", dateYearOne: "", dateYearTwo: "", verification: "" }]
    };
  });
}

export function removeClassroomVisit(index: number) {
  formStore.update(data => {
    return {
      ...data,
      classroomVisits: data.classroomVisits.filter((_, i) => i !== index)
    };
  });
}

export function addOtherActivity() {
  formStore.update(data => {
    return {
      ...data,
      otherActivities: [...data.otherActivities, { date: "", activity: "", dateYearOne: "", dateYearTwo: "", verification: "" }]
    };
  });
}

export function removeOtherActivity(index: number) {
  formStore.update(data => {
    return {
      ...data,
      otherActivities: data.otherActivities.filter((_, i) => i !== index)
    };
  });
}

// Functions for form actions
export function printForm() {
  window.print();
}

export function saveForm() {
  // Initialize with default empty form data to avoid 'used before assigned' error
  let currentValue: FormData = { ...initialFormData };
  
  // Get the current value from the store
  const unsubscribe = formStore.subscribe(value => {
    currentValue = value;
  });
  
  // Unsubscribe to avoid memory leaks
  unsubscribe();
  
  console.log('Form data saved:', currentValue);
  // In a real implementation, this would save to a database or file
}
