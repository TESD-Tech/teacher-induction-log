// saveManager.ts - Manages form auto-save functionality

import { formConfigStore, type FormConfig } from './formStore';
import { debounce } from '../utils';

const AUTO_SAVE_DELAY = 3000; // 3 seconds
const LOCAL_STORAGE_KEY = 'teacher-induction-log-data';

/**
 * Initialize the auto-save functionality
 */
export function initializeAutoSave(): void {
  // Load data from local storage on initialization
  loadFromLocalStorage();
  
  // Subscribe to form store changes and save when changes occur
  const unsubscribe = formConfigStore.subscribe(debouncedSave);
  
  // Return unsubscribe function for cleanup
  return unsubscribe;
}

/**
 * Save form data to localStorage
 * @param formConfig - Current form configuration
 */
function saveToLocalStorage(formConfig: FormConfig): void {
  try {
    const serializedData = JSON.stringify(formConfig);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedData);
    console.log('Form data auto-saved:', new Date().toLocaleTimeString());
  } catch (error) {
    console.error('Error saving form data to localStorage:', error);
  }
}

/**
 * Load form data from localStorage
 */
function loadFromLocalStorage(): void {
  try {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const formConfig = JSON.parse(savedData) as FormConfig;
      // Update the store with the saved data
      formConfigStore.set(formConfig);
      console.log('Form data loaded from localStorage');
    }
  } catch (error) {
    console.error('Error loading form data from localStorage:', error);
  }
}

/**
 * Manually save the current form state
 */
export function manualSave(): void {
  let currentConfig: FormConfig;
  
  // Get the current configuration from the store
  const unsubscribe = formConfigStore.subscribe((value) => {
    currentConfig = value;
  });
  
  unsubscribe(); // Clean up subscription
  
  // Save to localStorage
  saveToLocalStorage(currentConfig);
  
  return true; // Return success
}

/**
 * Clear saved form data from localStorage
 */
export function clearSavedData(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    console.log('Saved form data cleared');
  } catch (error) {
    console.error('Error clearing saved form data:', error);
  }
}

// Create a debounced save function to prevent excessive saves during rapid changes
const debouncedSave = debounce(saveToLocalStorage, AUTO_SAVE_DELAY);
