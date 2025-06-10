import { writable } from 'svelte/store';

// Browser detection
const browser = typeof window !== 'undefined';

// Settings interface
export interface AdminSettings {
  // Section visibility
  sections: {
    dashboard: boolean;
    quickSearch: boolean;
    advancedFilters: boolean;
    bulkActions: boolean;
    statistics: boolean;
    tableFilters: boolean;
  };
  
  // Table preferences
  table: {
    rowsPerPage: number;
    defaultSort: {
      column: string;
      direction: 'asc' | 'desc';
    };
    visibleColumns: string[];
  };
  
  // UI preferences
  ui: {
    theme: 'light' | 'dark' | 'auto';
    compactView: boolean;
    autoRefresh: boolean;
    autoRefreshInterval: number; // minutes
  };
  
  // Filter defaults
  defaultFilters: {
    building: string[];
    assignment: string[];
    schoolYear: string[];
    status: string[];
  };
}

// Default settings
const defaultSettings: AdminSettings = {
  sections: {
    dashboard: true,
    quickSearch: true,
    advancedFilters: false,
    bulkActions: true,
    statistics: true,
    tableFilters: true,
  },
  table: {
    rowsPerPage: 25,
    defaultSort: {
      column: 'lastModified',
      direction: 'desc',
    },
    visibleColumns: ['inductee', 'building', 'assignment', 'status', 'lastModified', 'actions'],
  },
  ui: {
    theme: 'auto',
    compactView: false,
    autoRefresh: false,
    autoRefreshInterval: 5,
  },
  defaultFilters: {
    building: [],
    assignment: [],
    schoolYear: [],
    status: [],
  },
};

// Local storage key
const SETTINGS_KEY = 'teacher-induction-admin-settings';

// Load settings from localStorage
function loadSettings(): AdminSettings {
  if (!browser) return defaultSettings;
  
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return defaultSettings;
    
    const parsed = JSON.parse(stored);
    
    // Merge with defaults to handle new settings added in updates
    return {
      ...defaultSettings,
      ...parsed,
      sections: { ...defaultSettings.sections, ...parsed.sections },
      table: { ...defaultSettings.table, ...parsed.table },
      ui: { ...defaultSettings.ui, ...parsed.ui },
      defaultFilters: { ...defaultSettings.defaultFilters, ...parsed.defaultFilters },
    };
  } catch (error) {
    console.warn('Failed to load admin settings from localStorage:', error);
    return defaultSettings;
  }
}

// Save settings to localStorage
function saveSettings(settings: AdminSettings): void {
  if (!browser) return;
  
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save admin settings to localStorage:', error);
  }
}

// Create the settings store
function createSettingsStore() {
  const { subscribe, set, update } = writable<AdminSettings>(loadSettings());

  return {
    subscribe,
    
    // Update specific section
    updateSection: (section: keyof AdminSettings['sections'], visible: boolean) => {
      update(settings => {
        const newSettings = {
          ...settings,
          sections: {
            ...settings.sections,
            [section]: visible,
          },
        };
        saveSettings(newSettings);
        return newSettings;
      });
    },
    
    // Update table preferences
    updateTable: (tableSettings: Partial<AdminSettings['table']>) => {
      update(settings => {
        const newSettings = {
          ...settings,
          table: {
            ...settings.table,
            ...tableSettings,
          },
        };
        saveSettings(newSettings);
        return newSettings;
      });
    },
    
    // Update UI preferences
    updateUI: (uiSettings: Partial<AdminSettings['ui']>) => {
      update(settings => {
        const newSettings = {
          ...settings,
          ui: {
            ...settings.ui,
            ...uiSettings,
          },
        };
        saveSettings(newSettings);
        return newSettings;
      });
    },
    
    // Update default filters
    updateDefaultFilters: (filters: Partial<AdminSettings['defaultFilters']>) => {
      update(settings => {
        const newSettings = {
          ...settings,
          defaultFilters: {
            ...settings.defaultFilters,
            ...filters,
          },
        };
        saveSettings(newSettings);
        return newSettings;
      });
    },
    
    // Reset to defaults
    reset: () => {
      const newSettings = { ...defaultSettings };
      saveSettings(newSettings);
      set(newSettings);
    },
    
    // Export settings
    export: () => {
      const settings = loadSettings();
      return JSON.stringify(settings, null, 2);
    },
    
    // Import settings
    import: (settingsJson: string) => {
      try {
        const imported = JSON.parse(settingsJson);
        const merged = {
          ...defaultSettings,
          ...imported,
          sections: { ...defaultSettings.sections, ...imported.sections },
          table: { ...defaultSettings.table, ...imported.table },
          ui: { ...defaultSettings.ui, ...imported.ui },
          defaultFilters: { ...defaultSettings.defaultFilters, ...imported.defaultFilters },
        };
        saveSettings(merged);
        set(merged);
        return true;
      } catch (error) {
        console.error('Failed to import settings:', error);
        return false;
      }
    },
  };
}

export const settingsStore = createSettingsStore();
