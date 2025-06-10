<script lang="ts">
  import { settingsStore, type AdminSettings } from '../../stores/settingsStore';
  import Button from '../ui/Button.svelte';

  // Props
  interface Props {
    open: boolean;
    onClose: () => void;
  }
  
  let { open, onClose }: Props = $props();

  // Local state
  let activeTab = $state('sections');
  let settings = $state<AdminSettings>($settingsStore);
  let exportText = $state('');
  let importText = $state('');
  let importError = $state('');

  // Update local settings when store changes
  $effect(() => {
    settings = $settingsStore;
  });

  // Handle section toggle
  function toggleSection(section: keyof AdminSettings['sections']) {
    settingsStore.updateSection(section, !settings.sections[section]);
  }

  // Handle table settings
  function updateTableSetting(key: keyof AdminSettings['table'], value: any) {
    settingsStore.updateTable({ [key]: value });
  }

  // Handle UI settings
  function updateUISetting(key: keyof AdminSettings['ui'], value: any) {
    settingsStore.updateUI({ [key]: value });
  }

  // Handle select change events
  function handleSelectChange(callback: (value: string) => void) {
    return (event: Event) => {
      const target = event.target as HTMLSelectElement;
      callback(target.value);
    };
  }

  // Handle checkbox change events
  function handleCheckboxChange(callback: (checked: boolean) => void) {
    return (event: Event) => {
      const target = event.target as HTMLInputElement;
      callback(target.checked);
    };
  }

  // Handle default filter updates
  function updateDefaultFilter(key: keyof AdminSettings['defaultFilters'], value: string[]) {
    settingsStore.updateDefaultFilters({ [key]: value });
  }

  // Export settings
  function handleExport() {
    exportText = settingsStore.export();
  }

  // Import settings
  function handleImport() {
    importError = '';
    if (!importText.trim()) {
      importError = 'Please enter settings JSON to import';
      return;
    }
    
    const success = settingsStore.import(importText);
    if (success) {
      importText = '';
      importError = '';
    } else {
      importError = 'Invalid settings JSON format';
    }
  }

  // Reset settings
  function handleReset() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      settingsStore.reset();
    }
  }

  // Handle backdrop click
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  // Available column options
  const columnOptions = [
    { value: 'inductee', label: 'Inductee Name' },
    { value: 'building', label: 'Building' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'schoolYear', label: 'School Year' },
    { value: 'status', label: 'Status' },
    { value: 'completionPercentage', label: 'Completion %' },
    { value: 'lastModified', label: 'Last Modified' },
    { value: 'mentor', label: 'Mentor' },
    { value: 'verificationCount', label: 'Verifications' },
    { value: 'actions', label: 'Actions' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'inductee', label: 'Inductee Name' },
    { value: 'building', label: 'Building' },
    { value: 'lastModified', label: 'Last Modified' },
    { value: 'status', label: 'Status' },
  ];

  // Theme options
  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto (System)' },
  ];

  // Rows per page options
  const rowsPerPageOptions = [
    { value: '10', label: '10 rows' },
    { value: '25', label: '25 rows' },
    { value: '50', label: '50 rows' },
    { value: '100', label: '100 rows' },
  ];
</script>

{#if open}
  <div 
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="settings-modal-title"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 id="settings-modal-title" class="text-2xl font-semibold text-green-600">Admin Panel Settings</h2>
        <button class="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1" onclick={onClose}>×</button>
      </div>

      <div class="flex-1 overflow-hidden flex flex-col">
        <!-- Tab Navigation -->
        <div class="flex border-b border-gray-200 px-6">
          <button 
            class="px-5 py-4 text-sm font-medium border-b-2 transition-colors {activeTab === 'sections' ? 'text-green-600 border-green-600' : 'text-gray-500 border-transparent hover:text-green-600 hover:bg-green-50'}"
            onclick={() => activeTab = 'sections'}
          >
            📱 Sections
          </button>
          <button 
            class="px-5 py-4 text-sm font-medium border-b-2 transition-colors {activeTab === 'table' ? 'text-green-600 border-green-600' : 'text-gray-500 border-transparent hover:text-green-600 hover:bg-green-50'}"
            onclick={() => activeTab = 'table'}
          >
            📊 Table
          </button>
          <button 
            class="px-5 py-4 text-sm font-medium border-b-2 transition-colors {activeTab === 'ui' ? 'text-green-600 border-green-600' : 'text-gray-500 border-transparent hover:text-green-600 hover:bg-green-50'}"
            onclick={() => activeTab = 'ui'}
          >
            🎨 Interface
          </button>
          <button 
            class="px-5 py-4 text-sm font-medium border-b-2 transition-colors {activeTab === 'import-export' ? 'text-green-600 border-green-600' : 'text-gray-500 border-transparent hover:text-green-600 hover:bg-green-50'}"
            onclick={() => activeTab = 'import-export'}
          >
            💾 Import/Export
          </button>
        </div>

        <!-- Tab Content -->
        <div class="flex-1 overflow-y-auto p-6">
          {#if activeTab === 'sections'}
            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Section Visibility</h3>
                <p class="text-gray-600 text-sm mb-6">Choose which sections to display in the admin panel</p>
              </div>
              
              <div class="grid gap-4">
                <label class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={settings.sections.dashboard}
                    onchange={() => toggleSection('dashboard')}
                    class="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">📈 Statistics Dashboard</div>
                    <div class="text-sm text-gray-500">Overview cards with key metrics</div>
                  </div>
                </label>

                <label class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={settings.sections.quickSearch}
                    onchange={() => toggleSection('quickSearch')}
                    class="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">🔍 Quick Search</div>
                    <div class="text-sm text-gray-500">Search bar and basic filters</div>
                  </div>
                </label>

                <label class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={settings.sections.advancedFilters}
                    onchange={() => toggleSection('advancedFilters')}
                    class="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">🎯 Advanced Filters</div>
                    <div class="text-sm text-gray-500">Detailed filtering options</div>
                  </div>
                </label>

                <label class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={settings.sections.bulkActions}
                    onchange={() => toggleSection('bulkActions')}
                    class="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">⚡ Bulk Actions</div>
                    <div class="text-sm text-gray-500">Multi-select operations</div>
                  </div>
                </label>

                <label class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={settings.sections.statistics}
                    onchange={() => toggleSection('statistics')}
                    class="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">📊 Detailed Statistics</div>
                    <div class="text-sm text-gray-500">Expanded analytics and charts</div>
                  </div>
                </label>

                <label class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={settings.sections.tableFilters}
                    onchange={() => toggleSection('tableFilters')}
                    class="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">🔧 Table Filters</div>
                    <div class="text-sm text-gray-500">Column-based filtering controls</div>
                  </div>
                </label>
              </div>
            </div>

          {:else if activeTab === 'table'}
            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Table Preferences</h3>
                <p class="text-gray-600 text-sm mb-6">Customize how the data table displays information</p>
              </div>
              
              <div class="space-y-6">
                <div class="flex items-center gap-4">
                  <label for="rows-per-page" class="text-sm font-medium text-gray-700 min-w-[140px]">Rows per page:</label>
                  <select
                    id="rows-per-page"
                    value={String(settings.table.rowsPerPage)}
                    onchange={handleSelectChange((value) => updateTableSetting('rowsPerPage', parseInt(value)))}
                    class="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-sm min-w-[140px]"
                  >
                    {#each rowsPerPageOptions as option}
                      <option value={option.value}>{option.label}</option>
                    {/each}
                  </select>
                </div>

                <div class="flex items-center gap-4">
                  <label for="default-sort" class="text-sm font-medium text-gray-700 min-w-[140px]">Default sort column:</label>
                  <select
                    id="default-sort"
                    value={settings.table.defaultSort.column}
                    onchange={handleSelectChange((value) => updateTableSetting('defaultSort', { ...settings.table.defaultSort, column: value }))}
                    class="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-sm min-w-[140px]"
                  >
                    {#each sortOptions as option}
                      <option value={option.value}>{option.label}</option>
                    {/each}
                  </select>
                </div>

                <div class="flex items-center gap-4">
                  <label for="sort-direction" class="text-sm font-medium text-gray-700 min-w-[140px]">Sort direction:</label>
                  <select
                    id="sort-direction"
                    value={settings.table.defaultSort.direction}
                    onchange={handleSelectChange((value) => updateTableSetting('defaultSort', { ...settings.table.defaultSort, direction: value }))}
                    class="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-sm min-w-[140px]"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>

                <div>
                  <span class="block text-sm font-medium text-gray-700 mb-3">Visible columns:</span>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {#each columnOptions as option}
                      <label class="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.table.visibleColumns.includes(option.value)}
                          onchange={handleCheckboxChange((checked) => {
                            const current = settings.table.visibleColumns;
                            const newColumns = checked 
                              ? [...current, option.value]
                              : current.filter(col => col !== option.value);
                            updateTableSetting('visibleColumns', newColumns);
                          })}
                          class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span class="text-sm text-gray-700">{option.label}</span>
                      </label>
                    {/each}
                  </div>
                </div>
              </div>
            </div>

          {:else if activeTab === 'ui'}
            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Interface Preferences</h3>
                <p class="text-gray-600 text-sm mb-6">Customize the look and behavior of the admin panel</p>
              </div>
              
              <div class="space-y-6">
                <div class="flex items-center gap-4">
                  <label for="theme" class="text-sm font-medium text-gray-700 min-w-[140px]">Theme:</label>
                  <select
                    id="theme"
                    value={settings.ui.theme}
                    onchange={handleSelectChange((value) => updateUISetting('theme', value))}
                    class="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-sm min-w-[140px]"
                  >
                    {#each themeOptions as option}
                      <option value={option.value}>{option.label}</option>
                    {/each}
                  </select>
                </div>

                <label class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={settings.ui.compactView}
                    onchange={handleCheckboxChange((checked) => updateUISetting('compactView', checked))}
                    class="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">Compact View</div>
                    <div class="text-sm text-gray-500">Reduce spacing and use smaller elements</div>
                  </div>
                </label>

                <label class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={settings.ui.autoRefresh}
                    onchange={handleCheckboxChange((checked) => updateUISetting('autoRefresh', checked))}
                    class="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">Auto Refresh</div>
                    <div class="text-sm text-gray-500">Automatically reload data periodically</div>
                  </div>
                </label>

                {#if settings.ui.autoRefresh}
                  <div class="flex items-center gap-4 ml-7">
                    <label for="refresh-interval" class="text-sm font-medium text-gray-700 min-w-[140px]">Refresh interval (minutes):</label>
                    <input 
                      type="number" 
                      id="refresh-interval"
                      min="1" 
                      max="60"
                      value={settings.ui.autoRefreshInterval}
                      onchange={handleSelectChange((value) => updateUISetting('autoRefreshInterval', parseInt(value)))}
                      class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                    />
                  </div>
                {/if}
              </div>
            </div>

          {:else if activeTab === 'import-export'}
            <div class="space-y-8">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Import & Export Settings</h3>
                <p class="text-gray-600 text-sm mb-6">Save or restore your admin panel configuration</p>
              </div>
              
              <div class="space-y-8">
                <div class="bg-gray-50 p-6 rounded-lg">
                  <h4 class="text-lg font-medium text-gray-900 mb-2">Export Settings</h4>
                  <p class="text-gray-600 text-sm mb-4">Export your current settings as JSON:</p>
                  <button 
                    onclick={handleExport} 
                    class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors mb-4"
                  >
                    📤 Export Settings
                  </button>
                  
                  {#if exportText}
                    <textarea 
                      class="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-xs bg-white resize-none" 
                      readonly 
                      value={exportText}
                      placeholder="Exported settings will appear here..."
                    ></textarea>
                  {/if}
                </div>

                <div class="bg-gray-50 p-6 rounded-lg">
                  <h4 class="text-lg font-medium text-gray-900 mb-2">Import Settings</h4>
                  <p class="text-gray-600 text-sm mb-4">Import settings from JSON:</p>
                  <textarea 
                    class="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-xs mb-3 resize-none"
                    bind:value={importText}
                    placeholder="Paste exported settings JSON here..."
                  ></textarea>
                  
                  {#if importError}
                    <div class="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3 mb-3">{importError}</div>
                  {/if}
                  
                  <button 
                    onclick={handleImport} 
                    class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    📥 Import Settings
                  </button>
                </div>

                <div class="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h4 class="text-lg font-medium text-red-900 mb-2">Reset Settings</h4>
                  <p class="text-red-700 text-sm mb-4">Reset all settings to their default values:</p>
                  <button 
                    onclick={handleReset} 
                    class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                  >
                    🔄 Reset to Defaults
                  </button>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <div class="p-6 border-t border-gray-200 flex justify-end">
        <button 
          onclick={onClose} 
          class="inline-flex items-center px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* All styling now done with Tailwind CSS classes */
</style>
