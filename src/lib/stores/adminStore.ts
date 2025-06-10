import { writable, derived } from 'svelte/store';
import type { FormData, JsonClobEntry, RawFormConfig } from './formStore';
import { parseFormConfig } from './formStore';

// Admin-specific interfaces
export interface ParsedLogEntry {
  id: string;
  data: FormData;
  completionStatus: 'complete' | 'pending' | 'incomplete';
  lastModified: Date;
  verificationCount: number;
  missingVerifications: string[];
}

export interface AdminFilters {
  building: string[];
  assignment: string[];
  schoolYear: string[];
  status: string[];
  search: string;
  dateRange: {
    from: string;
    to: string;
  };
}

export interface AdminState {
  logs: ParsedLogEntry[];
  selectedLogIds: string[];
  filters: AdminFilters;
  loading: boolean;
  error: string | null;
  rawConfig: RawFormConfig | null;
}

// Initial state
const initialFilters: AdminFilters = {
  building: [],
  assignment: [],
  schoolYear: [],
  status: [],
  search: '',
  dateRange: {
    from: '',
    to: ''
  }
};

const initialState: AdminState = {
  logs: [],
  selectedLogIds: [],
  filters: initialFilters,
  loading: false,
  error: null,
  rawConfig: null
};

// Create stores
export const adminStore = writable<AdminState>(initialState);

// Helper functions
function calculateCompletionStatus(data: FormData): 'complete' | 'pending' | 'incomplete' {
  // Calculate based on filled fields and verification status
  const hasBasicInfo = !!(data.inductee && data.building && data.assignment);
  const hasSignatures = !!(data.signatures?.mentorTeacher || data.signatures?.buildingPrincipal);
  
  // Count completed activities
  const summerAcademyCompleted = data.summerAcademy?.filter(item => item.dateYearOne).length || 0;
  const seminarsCompleted = data.inductionSeminars?.filter(item => item.dateYearOne).length || 0;
  const meetingsCompleted = (data.mentorMeetings?.length || 0) + (data.teamMeetings?.length || 0);
  
  const totalActivities = summerAcademyCompleted + seminarsCompleted + meetingsCompleted;
  
  if (!hasBasicInfo || totalActivities === 0) {
    return 'incomplete';
  }
  
  if (hasSignatures && totalActivities >= 5) {
    return 'complete';
  }
  
  return 'pending';
}

function countVerifications(data: FormData): number {
  let count = 0;
  
  // Count verifications in each section
  data.summerAcademy?.forEach(item => item.verification && count++);
  data.inductionSeminars?.forEach(item => item.verification && count++);
  data.mentorMeetings?.forEach(item => item.verification && count++);
  data.teamMeetings?.forEach(item => item.verification && count++);
  data.classroomVisits?.forEach(item => item.verification && count++);
  data.otherActivities?.forEach(item => item.verification && count++);
  
  return count;
}

function findMissingVerifications(data: FormData): string[] {
  const missing: string[] = [];
  
  // Check each section for missing verifications
  data.summerAcademy?.forEach((item, index) => {
    if (item.dateYearOne && !item.verification) {
      missing.push(`Summer Academy Day ${index + 1}`);
    }
  });
  
  data.inductionSeminars?.forEach((item, index) => {
    if (item.dateYearOne && !item.verification) {
      missing.push(`Induction Seminar ${index + 1}`);
    }
  });
  
  data.mentorMeetings?.forEach((item, index) => {
    if (item.dateYearOne && !item.verification) {
      missing.push(`Mentor Meeting ${index + 1}`);
    }
  });
  
  return missing;
}

function generateLogId(data: FormData, index: number): string {
  // Generate a unique ID for each log
  const name = data.inductee?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || `log${index}`;
  const year = data.schoolYearOne || 'unknown';
  return `${name}-${year}-${index}`;
}

function parseLogEntry(jsonClob: JsonClobEntry, index: number): ParsedLogEntry {
  try {
    const parsedData: FormData = JSON.parse(jsonClob.JSON_CLOB);
    const id = generateLogId(parsedData, index);
    
    return {
      id,
      data: parsedData,
      completionStatus: calculateCompletionStatus(parsedData),
      lastModified: new Date(), // In real implementation, this would come from the data
      verificationCount: countVerifications(parsedData),
      missingVerifications: findMissingVerifications(parsedData)
    };
  } catch (error) {
    console.error('Error parsing log entry:', error);
    // Return a placeholder entry for invalid JSON
    return {
      id: `error-${index}`,
      data: {} as FormData,
      completionStatus: 'incomplete',
      lastModified: new Date(),
      verificationCount: 0,
      missingVerifications: ['Invalid data']
    };
  }
}

// Actions
export const adminActions = {
  async loadLogs() {
    console.log('adminActions.loadLogs() called');
    adminStore.update(state => ({ ...state, loading: true, error: null }));
    
    try {
      // For development, always use the simple path since Vite serves public files at root
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      let configUrl = '';
      
      if (isDevelopment) {
        configUrl = '/teacher-induction-log/log.json';
      } else {
        // Production URLs for PowerSchool
        const pathname = window.location.pathname;
        const baseUrl = window.location.origin;
        if (pathname.includes('/admin/')) {
          configUrl = `${baseUrl}/admin/teacher-induction-log/log.json`;
        } else {
          configUrl = `${baseUrl}/teacher-induction-log/log.json`;
        }
      }
      
      console.log('Loading admin logs from:', configUrl);
      
      const response = await fetch(configUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`);
      }
      
      const rawConfig: RawFormConfig = await response.json();
      
      // Parse logs from JSON_CLOB format
      let logs: ParsedLogEntry[] = [];
      
      if (Array.isArray(rawConfig.data)) {
        // JSON_CLOB format
        logs = rawConfig.data.map((entry, index) => parseLogEntry(entry, index));
      } else {
        // Legacy format - single log
        const singleLog: ParsedLogEntry = {
          id: 'legacy-0',
          data: rawConfig.data,
          completionStatus: calculateCompletionStatus(rawConfig.data),
          lastModified: new Date(),
          verificationCount: countVerifications(rawConfig.data),
          missingVerifications: findMissingVerifications(rawConfig.data)
        };
        logs = [singleLog];
      }
      
      adminStore.update(state => ({
        ...state,
        logs,
        rawConfig,
        loading: false,
        error: null
      }));
      
      console.log(`Loaded ${logs.length} logs successfully`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error loading logs:', error);
      
      adminStore.update(state => ({
        ...state,
        loading: false,
        error: errorMessage
      }));
    }
  },
  
  setFilters(filters: Partial<AdminFilters>) {
    adminStore.update(state => ({
      ...state,
      filters: { ...state.filters, ...filters }
    }));
  },
  
  clearFilters() {
    adminStore.update(state => ({
      ...state,
      filters: initialFilters
    }));
  },
  
  selectLog(logId: string) {
    adminStore.update(state => ({
      ...state,
      selectedLogIds: [...state.selectedLogIds, logId]
    }));
  },
  
  deselectLog(logId: string) {
    adminStore.update(state => ({
      ...state,
      selectedLogIds: state.selectedLogIds.filter(id => id !== logId)
    }));
  },
  
  toggleLogSelection(logId: string) {
    adminStore.update(state => {
      const isSelected = state.selectedLogIds.includes(logId);
      return {
        ...state,
        selectedLogIds: isSelected
          ? state.selectedLogIds.filter(id => id !== logId)
          : [...state.selectedLogIds, logId]
      };
    });
  },
  
  selectAllLogs() {
    adminStore.update(state => ({
      ...state,
      selectedLogIds: state.logs.map(log => log.id)
    }));
  },
  
  deselectAllLogs() {
    adminStore.update(state => ({
      ...state,
      selectedLogIds: []
    }));
  }
};

// Derived stores for computed values
export const filteredLogs = derived(adminStore, ($adminStore) => {
  let filtered = $adminStore.logs;
  const { filters } = $adminStore;
  
  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(log => 
      log.data.inductee?.toLowerCase().includes(searchLower) ||
      log.data.building?.toLowerCase().includes(searchLower) ||
      log.data.assignment?.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply building filter
  if (filters.building.length > 0) {
    filtered = filtered.filter(log => 
      filters.building.includes(log.data.building || '')
    );
  }
  
  // Apply assignment filter
  if (filters.assignment.length > 0) {
    filtered = filtered.filter(log => 
      filters.assignment.includes(log.data.assignment || '')
    );
  }
  
  // Apply school year filter
  if (filters.schoolYear.length > 0) {
    filtered = filtered.filter(log => 
      filters.schoolYear.includes(log.data.schoolYearOne || '')
    );
  }
  
  // Apply status filter
  if (filters.status.length > 0) {
    filtered = filtered.filter(log => 
      filters.status.includes(log.completionStatus)
    );
  }
  
  return filtered;
});

export const adminStats = derived(adminStore, ($adminStore) => {
  const { logs } = $adminStore;
  
  const total = logs.length;
  const complete = logs.filter(log => log.completionStatus === 'complete').length;
  const pending = logs.filter(log => log.completionStatus === 'pending').length;
  const incomplete = logs.filter(log => log.completionStatus === 'incomplete').length;
  
  const totalVerifications = logs.reduce((sum, log) => sum + log.verificationCount, 0);
  const averageVerifications = total > 0 ? Math.round(totalVerifications / total) : 0;
  
  return {
    total,
    complete,
    pending,
    incomplete,
    totalVerifications,
    averageVerifications,
    completionRate: total > 0 ? Math.round((complete / total) * 100) : 0
  };
});

export const selectedLogs = derived(adminStore, ($adminStore) => {
  return $adminStore.logs.filter(log => 
    $adminStore.selectedLogIds.includes(log.id)
  );
});
