<script lang="ts">
  import { onMount } from 'svelte';
  import { appStore, appActions, appStats, filteredLogs, selectedLogs } from './stores/appStore';
  import { settingsStore } from './stores/settingsStore';
  import AdminDashboard from './components/admin/AdminDashboard.svelte';
  import LogsTable from './components/admin/LogsTable.svelte';
  import SettingsModal from './components/admin/SettingsModalSimple.svelte';
  import Button from './components/ui/Button.svelte';
  import ActionsBar from './components/ui/ActionsBar.svelte';
  
  // Carbon Icons
  import Settings from "carbon-icons-svelte/lib/Settings.svelte";
  import Renew from "carbon-icons-svelte/lib/Renew.svelte";
  import Filter from "carbon-icons-svelte/lib/Filter.svelte";
  import Close from "carbon-icons-svelte/lib/Close.svelte";

  // Get derived stores
  const stats = appStats;
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
    appActions.loadLogs();
    
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
        appActions.loadLogs();
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
    appActions.setFilters({ search: searchValue });
  }

  // Handle clear all filters
  function handleClearFilters() {
    searchValue = '';
    appActions.clearFilters();
  }

  // Handle refresh data
  function handleRefresh() {
    appActions.loadLogs();
  }
</script>

<svelte:options customElement="teacher-induction-admin-app" />
<ActionsBar {handleRefresh} />

<div class="admin-panel" class:space-y-3={$settings.ui.compactView} class:space-y-6={!$settings.ui.compactView} data-testid="admin-panel">
  <!-- ActionsBar now provides the header and actions -->
  <!-- Statistics Dashboard -->
  <div class="main-content">
    {#if $settings.sections.dashboard}
      <AdminDashboard />
    {/if}

    <!-- Quick Filters and Search -->
    {#if $settings.sections.quickSearch}
      <div class="content-card" 
           class:compact={$settings.ui.compactView}>
        <div class="search-section">
          <div class="search-input-container">
            <input
              type="text"
              placeholder="Search by inductee name, building, or assignment..."
              bind:value={searchValue}
              oninput={handleSearch}
              class="search-input"
            />
          </div>
          
          <div class="search-actions">
            <Button 
              onclick={() => showFilters = !showFilters}
              variant="default"
              compact={true}
            >
              <span class="icon"><Filter size={16} /></span>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            <Button 
              onclick={handleClearFilters}
              variant="default"
              compact={true}
            >
              <span class="icon"><Close size={16} /></span>
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>
    {/if}

    <!-- Advanced Filters Panel (Phase 2) -->
    {#if $settings.sections.advancedFilters && showFilters}
      <div class="content-card placeholder-card">
        <div class="placeholder-content">
          <div class="placeholder-icon">🚧</div>
          <h3 class="placeholder-title">Advanced Filtering Coming Soon</h3>
          <p class="placeholder-text">Building, Assignment, School Year, and Status filters will be implemented in Phase 2</p>
        </div>
      </div>
    {/if}

    <!-- Bulk Actions Bar (shows when items are selected) -->
    {#if $settings.sections.bulkActions && $selected.length > 0}
      <div class="bulk-actions-bar" 
           class:compact={$settings.ui.compactView}>
        <div class="bulk-actions-content">
          <div class="bulk-info">
            <span class="selected-count">{$selected.length} selected</span>
            <Button 
              onclick={appActions.deselectAllLogs}
              variant="default"
              compact={true}
            >
              Clear Selection
            </Button>
          </div>
          
          <div class="bulk-operations">
            <span class="coming-soon">🚧 Bulk operations coming in Phase 2</span>
          </div>
        </div>
      </div>
    {/if}

    <!-- Error Display -->
    {#if appActions.error}
      <div class="error-card" 
           class:compact={$settings.ui.compactView}>
        <div class="error-content">
          <div class="error-icon">❌</div>
          <div class="error-details">
            <strong>Error:</strong> {appActions.error}
          </div>
          <Button 
            onclick={handleRefresh}
            variant="default"
            compact={true}
          >
            🔄 Retry
          </Button>
        </div>
      </div>
    {/if}

    <!-- Main Content -->
    <div class="main-content-card">
      {#if appActions.loading}
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading teacher induction logs...</p>
        </div>
      {:else if $logs.length === 0 && !appActions.error}
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3 class="empty-title">No logs found</h3>
          <p class="empty-description">No teacher induction logs match your current filters.</p>
          {#if searchValue || appActions.filters?.building?.length > 0}
            <Button 
              onclick={handleClearFilters} 
              variant="default"
            >
              <span class="icon">✨</span>
              Clear Filters
            </Button>
          {/if}
        </div>
      {:else}
        <!-- Logs Table -->
        <LogsTable />
      {/if}
    </div>
  </div>

  <!-- Settings Modal -->
  <SettingsModal 
    open={showSettings} 
    onClose={() => showSettings = false} 
  />
</div>

<style>
  .admin-panel {
    width: 100%;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background-color: #fbca28;
    color: #333;
  }

  /* Header Section with Clean White Design */
  .header-section {
    background: #ffffff;
    color: #333;
    border-bottom: 1px solid #e0e0e0;
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .header-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .district-title {
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: #666;
  }

  .separator {
    color: #999;
    font-weight: 300;
  }

  .app-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: #333;
  }

  .header-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .icon {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    margin-right: 0.25rem;
  }
  
  .icon :global(svg) {
    fill: currentColor;
  }

  /* Main Content Area */
  .main-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Content Cards */
  .content-card {
    background: white;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    border: 1px solid #ddd;
  }

  .content-card.compact {
    padding: 1rem;
  }

  .main-content-card {
    background: white;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border: 1px solid #ddd;
  }

  /* Search Section */
  .search-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .search-input-container {
    flex: 1;
    max-width: 500px;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    background: white;
  }

  .search-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .search-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  /* Placeholder Content */
  .placeholder-card {
    text-align: center;
    padding: 3rem 1.5rem;
  }

  .placeholder-content {
    max-width: 400px;
    margin: 0 auto;
  }

  .placeholder-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .placeholder-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #4b5563;
    margin-bottom: 0.5rem;
  }

  .placeholder-text {
    color: #6b7280;
    line-height: 1.6;
  }

  /* Bulk Actions Bar */
  .bulk-actions-bar {
    background: #e3f2fd;
    border: 1px solid #2196f3;
    border-radius: 4px;
    padding: 1rem 1.5rem;
  }

  .bulk-actions-bar.compact {
    padding: 0.75rem 1rem;
  }

  .bulk-actions-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .bulk-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .selected-count {
    font-weight: 600;
    color: #1565c0;
  }

  .coming-soon {
    color: #616161;
    font-style: italic;
    font-size: 0.875rem;
  }

  /* Error Card */
  .error-card {
    background: #ffebee;
    border: 1px solid #f44336;
    border-radius: 4px;
    padding: 1rem 1.5rem;
  }

  .error-card.compact {
    padding: 0.75rem 1rem;
  }

  .error-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .error-icon {
    font-size: 1.25rem;
  }

  .error-details {
    flex: 1;
    color: #c62828;
    font-weight: 500;
  }

  /* Loading State */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 4px solid #e1e5e9;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1.5rem;
  }

  .loading-text {
    color: #6b7280;
    font-size: 1rem;
    margin: 0;
  }

  /* Empty State */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    opacity: 0.6;
  }

  .empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #4b5563;
    margin-bottom: 0.75rem;
  }

  .empty-description {
    color: #6b7280;
    margin-bottom: 2rem;
    line-height: 1.6;
    max-width: 400px;
  }

  /* Animations */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .search-section {
      flex-direction: column;
      align-items: stretch;
    }

    .search-input-container {
      max-width: none;
    }

    .header-content {
      flex-direction: column;
      align-items: stretch;
    }

    .header-left {
      justify-content: center;
      text-align: center;
    }

    .header-actions {
      justify-content: center;
    }
  }

  @media (max-width: 768px) {
    .main-content {
      padding: 1rem;
      gap: 1rem;
    }

    .header-container {
      padding: 1rem;
    }

    .district-title {
      font-size: 0.75rem;
    }

    .app-title {
      font-size: 1.25rem;
    }
  }
</style>
