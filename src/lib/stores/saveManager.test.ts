import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formConfigStore } from './formStore';
import { initializeAutoSave, manualSave, clearSavedData } from './saveManager';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    store
  };
})();

// Mock console methods
const consoleMock = {
  log: vi.fn(),
  error: vi.fn()
};

describe('saveManager', () => {
  beforeEach(() => {
    // Setup mocks
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    global.console.log = consoleMock.log;
    global.console.error = consoleMock.error;
    
    // Reset mocks
    vi.clearAllMocks();
    localStorageMock.clear();
    
    // Reset store to default state
    formConfigStore.set({
      inductee: '',
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
    });
    
    // Use fake timers
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  describe('initializeAutoSave', () => {
    it('should load data from localStorage on initialization', () => {
      // Setup mock data in localStorage
      const mockData = {
        inductee: 'John Doe',
        building: 'Main Building',
        assignment: 'Math Teacher',
        mentorTeacher: 'Jane Smith',
        schoolYearOne: '2023-2024',
        schoolYearTwo: '2024-2025',
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
      };
      
      localStorageMock.setItem('teacher-induction-log-data', JSON.stringify(mockData));
      
      // Initialize auto-save
      const unsubscribe = initializeAutoSave();
      
      // Verify localStorage was read
      expect(localStorageMock.getItem).toHaveBeenCalledWith('teacher-induction-log-data');
      
      // Verify store was updated with localStorage data
      let storeValue;
      const storeUnsubscribe = formConfigStore.subscribe(value => {
        storeValue = value;
      });
      
      expect(storeValue).toEqual(mockData);
      
      // Clean up
      unsubscribe();
      storeUnsubscribe();
    });
    
    it('should save to localStorage when store changes', () => {
      // Initialize auto-save
      const unsubscribe = initializeAutoSave();
      
      // Update store
      formConfigStore.update(state => ({
        ...state,
        inductee: 'John Doe',
        building: 'Main Building'
      }));
      
      // Advance timers to trigger debounced save
      vi.advanceTimersByTime(3000);
      
      // Verify localStorage was updated
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData.inductee).toBe('John Doe');
      expect(savedData.building).toBe('Main Building');
      
      // Clean up
      unsubscribe();
    });
    
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage.getItem to throw an error
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('localStorage error');
      });
      
      // Initialize auto-save
      const unsubscribe = initializeAutoSave();
      
      // Verify error was logged
      expect(consoleMock.error).toHaveBeenCalled();
      expect(consoleMock.log).toHaveBeenCalledWith('[DEBUG] loadFromLocalStorage error caught', expect.any(Error));
      
      // Clean up
      unsubscribe();
    });
  });
  
  describe('manualSave', () => {
    it('should save current form state to localStorage', () => {
      // Update store
      formConfigStore.update(state => ({
        ...state,
        inductee: 'John Doe',
        building: 'Main Building'
      }));
      
      // Call manualSave
      const result = manualSave();
      
      // Verify result
      expect(result).toBe(true);
      
      // Verify localStorage was updated
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData.inductee).toBe('John Doe');
      expect(savedData.building).toBe('Main Building');
    });
    
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage.setItem to throw an error
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('localStorage error');
      });
      
      // Call manualSave
      const result = manualSave();
      
      // Verify result (still returns true despite error)
      expect(result).toBe(true);
      
      // Verify error was logged
      expect(consoleMock.error).toHaveBeenCalled();
      expect(consoleMock.log).toHaveBeenCalledWith('[DEBUG] saveToLocalStorage error caught', expect.any(Error));
    });
  });
  
  describe('clearSavedData', () => {
    it('should remove data from localStorage', () => {
      // Setup mock data in localStorage
      localStorageMock.setItem('teacher-induction-log-data', JSON.stringify({ inductee: 'John Doe' }));
      
      // Call clearSavedData
      clearSavedData();
      
      // Verify localStorage item was removed
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('teacher-induction-log-data');
      expect(consoleMock.log).toHaveBeenCalledWith('Saved form data cleared');
    });
    
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage.removeItem to throw an error
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('localStorage error');
      });
      
      // Call clearSavedData
      clearSavedData();
      
      // Verify error was logged
      expect(consoleMock.error).toHaveBeenCalled();
      expect(consoleMock.log).toHaveBeenCalledWith('[DEBUG] clearSavedData error caught', expect.any(Error));
    });
  });
});