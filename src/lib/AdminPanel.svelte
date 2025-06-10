<script lang="ts">
  import { onMount } from 'svelte';
  import { adminStore, adminActions, adminStats, filteredLogs, selectedLogs } from './stores/adminStore';
  import { settingsStore } from './stores/settingsStore';
  import AdminDashboard from './components/admin/AdminDashboard.svelte';
  import LogsTable from './components/admin/LogsTable.svelte';
  import SettingsModal from './components/admin/SettingsModal.svelte';
  import Button from './components/ui/Button.svelte';

  // Get derived stores
  const stats = adminStats;
  const logs = filteredLogs;
  const selected = selectedLogs;
  const settings = settingsStore;

  // Local state
  let showFilters = $state(false);
  let showSettings = $state(false);
  let searchValue = $state('');
  let autoRefreshTimer: ReturnType<typeof setInterval> | undefined = undefined;

  // Load data on component mount
  onMount(() => {
    console.log('AdminPanel mounted, loading logs...');
    adminActions.loadLogs();
    
    // Set up auto-refresh if enabled
    setupAutoRefresh();
    
    // Cleanup on unmount
    return () => {
      if (autoRefreshTimer) {
        clearInterval(autoRefreshTimer);
      }
    };
  });

  // Set up auto-refresh based on settings
  function setupAutoRefresh() {
    if (autoRefreshTimer) {
      clearInterval(autoRefreshTimer);
      autoRefreshTimer = undefined;
    }
    
    if ($settings.ui.autoRefresh && $settings.ui.autoRefreshInterval > 0) {
      const intervalMs = $settings.ui.autoRefreshInterval * 60 * 1000; // Convert minutes to ms
      autoRefreshTimer = setInterval(() => {
        console.log('Auto-refreshing admin data...');
        adminActions.loadLogs();
      }, intervalMs);
    }
  }

  // React to settings changes
  $effect(() => {
    setupAutoRefresh();
  });

  // Handle search input
  function handleSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    searchValue = target.value;
    adminActions.setFilters({ search: searchValue });
  }

  // Handle clear all filters
  function handleClearFilters() {
    searchValue = '';
    adminActions.clearFilters();
  }

  // Handle refresh data
  function handleRefresh() {
    adminActions.loadLogs();
  }
</script>

<svelte:options customElement="teacher-induction-admin-app" />

<div class="admin-panel bg-amber-50 min-h-screen font-sans" class:space-y-3={$settings.ui.compactView} class:space-y-6={!$settings.ui.compactView} data-testid="admin-panel">
  <!-- Header -->
  <div class="bg-white rounded-lg shadow-sm border border-gray-200" 
       class:p-3={$settings.ui.compactView} 
       class:p-6={!$settings.ui.compactView}>
    <div class="flex flex-col lg:flex-row justify-between lg:items-start gap-4">
      <div>
        <h1 class="text-green-600 font-semibold" 
            class:text-xl={$settings.ui.compactView} 
            class:text-3xl={!$settings.ui.compactView}>
          Teacher Induction Log Administration
        </h1>
        <p class="text-gray-600 mt-1" 
           class:text-sm={$settings.ui.compactView} 
           class:text-base={!$settings.ui.compactView}>
          Manage and monitor teacher induction programs
        </p>
      </div>
      <div class="flex gap-3">
        <button 
          onclick={() => showSettings = true}
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          ⚙️ Settings
        </button>
        <button 
          onclick={handleRefresh}
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          disabled={$adminStore.loading}
        >
          {$adminStore.loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
    </div>
  </div>

  <!-- Statistics Dashboard -->
  {#if $settings.sections.dashboard}
    <AdminDashboard />
  {/if}

  <!-- Quick Filters and Search -->
  {#if $settings.sections.quickSearch}
    <div class="bg-white rounded-lg shadow-sm border border-gray-200" 
         class:p-3={$settings.ui.compactView} 
         class:p-6={!$settings.ui.compactView}>
      <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div class="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by inductee name, building, or assignment..."
            bind:value={searchValue}
            oninput={handleSearch}
            class="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
          />
        </div>
        
        <div class="flex gap-3">
          <button 
            onclick={() => showFilters = !showFilters}
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <button 
            onclick={handleClearFilters}
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Advanced Filters Panel (Phase 2) -->
  {#if $settings.sections.advancedFilters && showFilters}
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="text-center py-12 text-gray-500">
        <p class="text-lg mb-2">🚧 Advanced filtering will be implemented in Phase 2</p>
        <p class="text-sm text-gray-400">Building, Assignment, School Year, and Status filters coming soon!</p>
      </div>
    </div>
  {/if}

  <!-- Bulk Actions Bar (shows when items are selected) -->
  {#if $settings.sections.bulkActions && $selected.length > 0}
    <div class="bg-blue-50 border-2 border-blue-200 rounded-lg" 
         class:p-3={$settings.ui.compactView} 
         class:p-4={!$settings.ui.compactView}>
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        <div class="flex items-center gap-3">
          <span class="font-semibold text-blue-700">{$selected.length} selected</span>
          <button 
            onclick={adminActions.deselectAllLogs}
            class="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Clear Selection
          </button>
        </div>
        
        <div class="text-gray-600 italic text-sm">
          🚧 Bulk operations coming in Phase 2
        </div>
      </div>
    </div>
  {/if}

  <!-- Error Display -->
  {#if $adminStore.error}
    <div class="bg-red-50 border-2 border-red-200 rounded-lg" 
         class:p-3={$settings.ui.compactView} 
         class:p-4={!$settings.ui.compactView}>
      <div class="flex justify-between items-center">
        <span class="text-red-800">
          <strong>Error:</strong> {$adminStore.error}
        </span>
        <button 
          onclick={handleRefresh}
          class="text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    </div>
  {/if}

  <!-- Main Content -->
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    {#if $adminStore.loading}
      <div class="flex flex-col items-center justify-center py-24 text-center">
        <div class="w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600">Loading teacher induction logs...</p>
      </div>
    {:else if $logs.length === 0 && !$adminStore.error}
      <div class="text-center py-24">
        <h3 class="text-xl text-gray-600 mb-3">No logs found</h3>
        <p class="text-gray-500 mb-6">No teacher induction logs match your current filters.</p>
        {#if searchValue || $adminStore.filters.building.length > 0}
          <button 
            onclick={handleClearFilters} 
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition-colors"
          >
            Clear Filters
          </button>
        {/if}
      </div>
    {:else}
      <!-- Logs Table -->
      <LogsTable />
    {/if}
  </div>

  <!-- Settings Modal -->
  <SettingsModal 
    open={showSettings} 
    onClose={() => showSettings = false} 
  />
</div>

<style>
  .admin-panel {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    .admin-panel {
      padding: 0.75rem;
    }
  }
</style>
