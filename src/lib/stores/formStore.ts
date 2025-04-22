import { writable, get, type Writable } from 'svelte/store';

// --- Base Interfaces ---
export interface BaseActivity {
  dateYearOne: string;
  dateYearTwo: string;
  verification: string;
}

export interface SummerAcademyDay extends BaseActivity {
  day: string; 
}

export interface InductionSeminar extends BaseActivity {
  number: number;
  topic: string;
}

export interface MentorMeeting extends BaseActivity {
  date: string;
  topic: string;
}

export interface TeamMeeting extends BaseActivity {
  date: string;
  topic: string;
}

export interface ClassroomVisit extends BaseActivity {
  date: string;
  teacher: string;
  subject: string;
}

export interface OtherActivity extends BaseActivity {
  date: string;
  activity: string;
}

export interface Signatures {
  mentorTeacher: string;
  buildingPrincipal: string;
  superintendent: string;
  date: string;
}

// --- Main Data Structure (Mentee Specific) ---
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

// --- NEW: Interface for Dropdown Options ---
export interface FormOptions {
  mentors: string[];
  buildings: string[];
  assignments: string[];
  schoolYears: string[];
  // Add any other option lists needed
}

// --- NEW: Interface for Editability Flags ---
export interface Editability {
  inductee: boolean;
  building: boolean;
  assignment: boolean;
  mentorTeacher: boolean;
  schoolYearOne: boolean;
  schoolYearTwo: boolean;
  summerAcademy: boolean;
  inductionSeminars: boolean;
  mentorMeetings: boolean;
  teamMeetings: boolean;
  classroomVisits: boolean;
  otherActivities: boolean;
  signatures: boolean;
  // Add other fields as needed
}

// --- User Role Type ---
export type UserRole = 'admin' | 'mentor' | 'mentee';

// --- UPDATED: Combined Configuration Interface ---
export interface FormConfig {
  data: FormData;
  userRole: UserRole;
  options: FormOptions;
  editable: Editability;
}

// --- Helper Function ---
export function createEmptyActivity<T extends BaseActivity>(additionalProps: Omit<T, keyof BaseActivity>): T {
  return {
    dateYearOne: "",
    dateYearTwo: "",
    verification: "",
    ...additionalProps
  } as T;
}

// --- Initial Values ---
const initialFormOptions: FormOptions = {
    mentors: [],
    buildings: [],
    assignments: [],
    schoolYears: [],
};

const initialFormData: FormData = {
  inductee: "",
  building: "",
  assignment: "",
  mentorTeacher: "",
  schoolYearOne: "",
  schoolYearTwo: "",
  summerAcademy: [
    createEmptyActivity<SummerAcademyDay>({ day: "Day 1" }),
    createEmptyActivity<SummerAcademyDay>({ day: "Day 2" }),
    createEmptyActivity<SummerAcademyDay>({ day: "Day 3" }),
    createEmptyActivity<SummerAcademyDay>({ day: "Day 4" })
  ],
  inductionSeminars: [
    createEmptyActivity<InductionSeminar>({ number: 1, topic: "" }),
    createEmptyActivity<InductionSeminar>({ number: 2, topic: "" }),
    createEmptyActivity<InductionSeminar>({ number: 3, topic: "" }),
    createEmptyActivity<InductionSeminar>({ number: 4, topic: "" })
  ],
  mentorMeetings: [
    createEmptyActivity<MentorMeeting>({ date: "", topic: "" })
  ],
  teamMeetings: [
    createEmptyActivity<TeamMeeting>({ date: "", topic: "" })
  ],
  classroomVisits: [
    createEmptyActivity<ClassroomVisit>({ date: "", teacher: "", subject: "" })
  ],
  otherActivities: [
    createEmptyActivity<OtherActivity>({ date: "", activity: "" })
  ],
  signatures: {
    mentorTeacher: "",
    buildingPrincipal: "",
    superintendent: "",
    date: ""
  }
};

const initialEditability: Editability = {
  inductee: false, 
  building: true,
  assignment: true,
  mentorTeacher: true,
  schoolYearOne: true,
  schoolYearTwo: true,
  summerAcademy: true,
  inductionSeminars: true,
  mentorMeetings: true,
  teamMeetings: true,
  classroomVisits: true,
  otherActivities: true,
  signatures: true
};

const initialFormConfig: FormConfig = {
  data: initialFormData,
  userRole: 'mentee', 
  options: initialFormOptions, 
  editable: initialEditability 
};

// --- Stores ---
export const formConfigStore: Writable<FormConfig> = writable<FormConfig>(initialFormConfig);
export const formStore: Writable<FormData> = writable<FormData>(initialFormData);

// --- Action Functions ---

// Helper to add activity
function addActivity<T extends BaseActivity>(
  currentData: FormData, 
  activityType: keyof Pick<FormData, 'mentorMeetings' | 'teamMeetings' | 'classroomVisits' | 'otherActivities'>,
  newActivity: T
): FormData {
  return {
    ...currentData,
    [activityType]: [...(currentData[activityType] as unknown as T[]), newActivity]
  };
}

// Helper to remove activity
function removeActivity<T extends BaseActivity>(
  currentData: FormData,
  activityType: keyof Pick<FormData, 'mentorMeetings' | 'teamMeetings' | 'classroomVisits' | 'otherActivities'>,
  index: number
): FormData {
  return {
    ...currentData,
    [activityType]: (currentData[activityType] as unknown as T[]).filter((_, i) => i !== index)
  };
}

// Add Mentor Meeting
export function addMentorMeeting(): void {
  formStore.update(data => {
    return addActivity<MentorMeeting>(
      data, 
      'mentorMeetings',
      createEmptyActivity<MentorMeeting>({ date: '', topic: '' })
    );
  });
}

// Remove Mentor Meeting
export function removeMentorMeeting(index: number): void {
  formStore.update(data => {
    return removeActivity<MentorMeeting>(data, 'mentorMeetings', index);
  });
}

// Add Team Meeting
export function addTeamMeeting(): void {
  formStore.update(data => {
    return addActivity<TeamMeeting>(
      data, 
      'teamMeetings',
      createEmptyActivity<TeamMeeting>({ date: '', topic: '' })
    );
  });
}

// Remove Team Meeting
export function removeTeamMeeting(index: number): void {
  formStore.update(data => {
    return removeActivity<TeamMeeting>(data, 'teamMeetings', index);
  });
}

// Add Classroom Visit
export function addClassroomVisit(): void {
  formStore.update(data => {
    return addActivity<ClassroomVisit>(
      data, 
      'classroomVisits',
      createEmptyActivity<ClassroomVisit>({ date: '', teacher: '', subject: '' })
    );
  });
}

// Remove Classroom Visit
export function removeClassroomVisit(index: number): void {
  formStore.update(data => {
    return removeActivity<ClassroomVisit>(data, 'classroomVisits', index);
  });
}

// Add Other Activity
export function addOtherActivity(): void {
  formStore.update(data => {
    return addActivity<OtherActivity>(
      data, 
      'otherActivities',
      createEmptyActivity<OtherActivity>({ date: '', activity: '' })
    );
  });
}

// Remove Other Activity
export function removeOtherActivity(index: number): void {
  formStore.update(data => {
    return removeActivity<OtherActivity>(data, 'otherActivities', index);
  });
}

// Print Form
export function printForm(): void {
  window.print();
}

// Save Form
export function saveForm(): void {
  console.log('[SaveForm] Starting save process...');
  const currentFormData = get(formStore); 
  console.log('[SaveForm] Current form data object:', currentFormData); 
  const jsonString = JSON.stringify(currentFormData);
  console.log('[SaveForm] Form data as JSON string:', [jsonString]);
  const inputElement = document.getElementById('json_clob'); // Make sure 'json_clob' is correct ID
  if (inputElement && inputElement instanceof HTMLInputElement) {
    console.log('[SaveForm] Found input element #json_clob.');
    inputElement.value = jsonString;
    console.log('[SaveForm] Updated value of #json_clob.');
    const formElement = inputElement.closest('form');
    if (formElement && formElement instanceof HTMLFormElement) {
      console.log('[SaveForm] Found parent form. Submitting...');
      try {
        formElement.submit();
        console.log('[SaveForm] Form submitted.');
      } catch (error) {
        console.error('[SaveForm] Error submitting form:', error);
      }
    } else {
      console.error('[SaveForm] Could not find parent form for #json_clob.');
    }
  } else {
    console.error('[SaveForm] Could not find input element with ID "json_clob" or it is not an HTMLInputElement.');
  }
}

// Set Form Configuration
export function setFormConfig(config: FormConfig, preserveVerifications = false): void {
  // Add checks if necessary to ensure config has data, options, editable, userRole
  if (config && config.data && config.options && config.editable && config.userRole) {
     formConfigStore.set(config);
     formStore.set(config.data);
  } else {
   console.error("Invalid config passed to setFormConfig", config);
   // Handle error appropriately - maybe set to initial state?
   // formConfigStore.set(initialFormConfig);
   // formStore.set(initialFormData);
  }
}