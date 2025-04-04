import { writable, get, type Writable } from 'svelte/store';

/**
 * Base activity interface with common properties for all activity types
 */
export interface BaseActivity {
  dateYearOne: string;
  dateYearTwo: string;
  verification: string;
}

/**
 * Summer Academy Day activity type
 */
export interface SummerAcademyDay extends BaseActivity {
  day: string; 
}

/**
 * Induction Seminar activity type
 */
export interface InductionSeminar extends BaseActivity {
  number: number;
  topic: string;
}

/**
 * Mentor Meeting activity type
 */
export interface MentorMeeting extends BaseActivity {
  date: string;
  topic: string;
}

/**
 * Team Meeting activity type
 */
export interface TeamMeeting extends BaseActivity {
  date: string;
  topic: string;
}

/**
 * Classroom Visit activity type
 */
export interface ClassroomVisit extends BaseActivity {
  date: string;
  teacher: string;
  subject: string;
}

/**
 * Other Activity type
 */
export interface OtherActivity extends BaseActivity {
  date: string;
  activity: string;
}

/**
 * Signatures for the form
 */
export interface Signatures {
  mentorTeacher: string;
  buildingPrincipal: string;
  superintendent: string;
  date: string;
}

/**
 * Main form data structure
 */
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

/**
 * Verification fields configuration
 */
export interface VerificationConfig {
  summerAcademy: boolean;
  inductionSeminars: boolean;
  mentorMeetings: boolean;
  teamMeetings: boolean;
  classroomVisits: boolean;
  otherActivities: boolean;
}

/**
 * Field editability configuration
 */
export interface EditabilityState {
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
  verifications: VerificationConfig;
}

/**
 * User role types
 */
export type UserRole = 'admin' | 'teacher';

/**
 * Combined configuration for the form
 */
export interface FormConfig {
  data: FormData;
  editable: EditabilityState;
  userRole: UserRole;
}

/**
 * Create a new empty activity with initial values
 */
function createEmptyActivity<T extends BaseActivity>(additionalProps: Omit<T, keyof BaseActivity>): T {
  return {
    dateYearOne: "",
    dateYearTwo: "",
    verification: "",
    ...additionalProps
  } as T;
}

// Initial form data with properly typed empty activities
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

// Default verification config - all verification fields are non-editable for teachers
const defaultVerificationConfig: VerificationConfig = {
  summerAcademy: false,
  inductionSeminars: false,
  mentorMeetings: false,
  teamMeetings: false,
  classroomVisits: false,
  otherActivities: false
};

// Initial editability state with verification config
const initialEditabilityState: EditabilityState = {
  inductee: true,
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
  signatures: true,
  verifications: { ...defaultVerificationConfig }
};

// Initial form configuration
const initialFormConfig: FormConfig = {
  data: initialFormData,
  editable: initialEditabilityState,
  userRole: 'teacher'
};

// Create the stores with proper types
export const formConfigStore: Writable<FormConfig> = writable<FormConfig>(initialFormConfig);
export const formStore: Writable<FormData> = writable<FormData>(initialFormData);

/**
 * Type-safe helper to add a new activity to an array
 */
function addActivity<T extends BaseActivity>(
  currentData: FormData, 
  activityType: keyof Pick<FormData, 'mentorMeetings' | 'teamMeetings' | 'classroomVisits' | 'otherActivities'>,
  newActivity: T
): FormData {
  return {
    ...currentData,
    [activityType]: [...(currentData[activityType] as T[]), newActivity]
  };
}

/**
 * Type-safe helper to remove an activity from an array
 */
function removeActivity<T extends BaseActivity>(
  currentData: FormData,
  activityType: keyof Pick<FormData, 'mentorMeetings' | 'teamMeetings' | 'classroomVisits' | 'otherActivities'>,
  index: number
): FormData {
  return {
    ...currentData,
    [activityType]: (currentData[activityType] as T[]).filter((_, i) => i !== index)
  };
}

/**
 * Add a new mentor meeting to the form
 */
export function addMentorMeeting(): void {
  formStore.update(data => {
    return addActivity<MentorMeeting>(
      data, 
      'mentorMeetings',
      createEmptyActivity<MentorMeeting>({ date: '', topic: '' })
    );
  });
}

/**
 * Remove a mentor meeting from the form
 */
export function removeMentorMeeting(index: number): void {
  formStore.update(data => {
    return removeActivity<MentorMeeting>(data, 'mentorMeetings', index);
  });
}

/**
 * Add a new team meeting to the form
 */
export function addTeamMeeting(): void {
  formStore.update(data => {
    return addActivity<TeamMeeting>(
      data, 
      'teamMeetings',
      createEmptyActivity<TeamMeeting>({ date: '', topic: '' })
    );
  });
}

/**
 * Remove a team meeting from the form
 */
export function removeTeamMeeting(index: number): void {
  formStore.update(data => {
    return removeActivity<TeamMeeting>(data, 'teamMeetings', index);
  });
}

/**
 * Add a new classroom visit to the form
 */
export function addClassroomVisit(): void {
  formStore.update(data => {
    return addActivity<ClassroomVisit>(
      data, 
      'classroomVisits',
      createEmptyActivity<ClassroomVisit>({ date: '', teacher: '', subject: '' })
    );
  });
}

/**
 * Remove a classroom visit from the form
 */
export function removeClassroomVisit(index: number): void {
  formStore.update(data => {
    return removeActivity<ClassroomVisit>(data, 'classroomVisits', index);
  });
}

/**
 * Add a new other activity to the form
 */
export function addOtherActivity(): void {
  formStore.update(data => {
    return addActivity<OtherActivity>(
      data, 
      'otherActivities',
      createEmptyActivity<OtherActivity>({ date: '', activity: '' })
    );
  });
}

/**
 * Remove an other activity from the form
 */
export function removeOtherActivity(index: number): void {
  formStore.update(data => {
    return removeActivity<OtherActivity>(data, 'otherActivities', index);
  });
}

/**
 * Print the form
 */
export function printForm(): void {
  window.print();
}

/**
 * Save the form data
 */
export function saveForm(): void {
  // Get the current configuration from the store
  const currentConfig = get(formConfigStore);
  
  console.log('Form data saved:', currentConfig.data);
  console.log('Form editability state:', currentConfig.editable);
  console.log('User role:', currentConfig.userRole);
  // In a real implementation, this would save to a database or file
}

/**
 * Get verification config based on user role
 */
function getVerificationConfigForRole(role: UserRole): VerificationConfig {
  if (role === 'admin') {
    return {
      summerAcademy: true,
      inductionSeminars: true,
      mentorMeetings: true,
      teamMeetings: true,
      classroomVisits: true,
      otherActivities: true
    };
  } else {
    return { ...defaultVerificationConfig };
  }
}

/**
 * Update the section editability settings based on user role
 */
function updateSectionEditability(editable: EditabilityState, userRole: UserRole): EditabilityState {
  // For both teachers and admins, ensure section editability is set to true
  // This allows teachers to edit other fields in the rows, but not verification fields
  return {
    ...editable,
    summerAcademy: true,
    inductionSeminars: true,
    mentorMeetings: true,
    teamMeetings: true,
    classroomVisits: true,
    otherActivities: true,
    verifications: getVerificationConfigForRole(userRole)
  };
}

/**
 * Set the entire form configuration
 */
export function setFormConfig(config: FormConfig, preserveVerifications = false): void {
  // Ensure verifications object exists with proper default values
  if (!config.editable.verifications) {
    config.editable.verifications = { ...defaultVerificationConfig };
  }
  
  // Update editability settings based on user role, unless preserveVerifications is true
  if (!preserveVerifications) {
    config.editable = updateSectionEditability(config.editable, config.userRole);
  }
  
  // Update both stores
  formConfigStore.set(config);
  formStore.set(config.data);
}
