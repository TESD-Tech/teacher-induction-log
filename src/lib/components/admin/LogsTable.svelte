<script lang="ts">
  import { filteredLogs, appActions, appStore, type ParsedLogEntry } from '../../stores/appStore';
  import { settingsStore } from '../../stores/settingsStore';
  import Button from '../ui/Button.svelte';
  import LogDetailsModal from './LogDetailsModal.svelte';
  
  // Carbon Icons
  import CheckmarkFilled from "carbon-icons-svelte/lib/CheckmarkFilled.svelte";
  import Time from "carbon-icons-svelte/lib/Time.svelte";
  import ErrorFilled from "carbon-icons-svelte/lib/ErrorFilled.svelte";
  import Unknown from "carbon-icons-svelte/lib/Unknown.svelte";
  
  // Get the filtered logs store and settings
  const logs = filteredLogs;
    const settings = settingsStore;
  
  // Local state for sorting - initialize from settings
  let sortColumn = $state<string>($settings.table.defaultSort.column);
  let sortDirection = $state<'asc' | 'desc'>($settings.table.defaultSort.direction);
  
  // Modal state
  let isModalOpen = $state(false);
  let selectedLog = $state<ParsedLogEntry | null>(null);
  
  // Update sort from settings when they change
  $effect(() => {
    sortColumn = $settings.table.defaultSort.column;
    sortDirection = $settings.table.defaultSort.direction;
  });

  // Helper function to check if a column should be visible
  function isColumnVisible(columnName: string): boolean {
    return $settings.table.visibleColumns.includes(columnName);
  }
  
  // Status badge styling
  function getStatusClass(status: string): string {
    switch (status) {
      case 'complete':
        return 'status-complete';
      case 'pending':
        return 'status-pending';
      case 'incomplete':
        return 'status-incomplete';
      default:
        return 'status-unknown';
    }
  }
  
  function getStatusIcon(status: string): any {
    switch (status) {
      case 'complete':
        return CheckmarkFilled;
      case 'pending':
        return Time;
      case 'incomplete':
        return ErrorFilled;
      default:
        return Unknown;
    }
  }
  
  function getStatusText(status: string): string {
    switch (status) {
      case 'complete':
        return 'Complete';
      case 'pending':
        return 'Pending Review';
      case 'incomplete':
        return 'Incomplete';
      default:
        return 'Unknown';
    }
  }
  
  // Sorting functionality
  function handleSort(column: string) {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }
  }
  
  // Sort the logs based on current sort settings
  const sortedLogs = $derived.by(() => {
    return [...$logs].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortColumn) {
        case 'inductee':
          aValue = a.data.inductee || '';
          bValue = b.data.inductee || '';
          break;
        case 'building':
          aValue = a.data.building || '';
          bValue = b.data.building || '';
          break;
        case 'assignment':
          aValue = a.data.assignment || '';
          bValue = b.data.assignment || '';
          break;
        case 'schoolYear':
          aValue = a.data.schoolYearOne || '';
          bValue = b.data.schoolYearOne || '';
          break;
        case 'status':
          aValue = a.completionStatus;
          bValue = b.completionStatus;
          break;
        case 'verifications':
          aValue = a.verificationCount;
          bValue = b.verificationCount;
          break;
        case 'lastModified':
          aValue = a.lastModified.getTime();
          bValue = b.lastModified.getTime();
          break;
        default:
          aValue = '';
          bValue = '';
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else {
        const comparison = aValue - bValue;
        return sortDirection === 'asc' ? comparison : -comparison;
      }
    });
  });
  
  // Selection handlers
  function handleRowSelect(logId: string) {
    appActions.toggleLogSelection(logId);
  }
  
  function handleSelectAll() {
    if ($appStore.selectedLogIds.length === $logs.length) {
      appActions.deselectAllLogs();
    } else {
      appActions.selectAllLogs();
    }
  }
  
  // Check if all visible logs are selected
  const allSelected = $derived($logs.length > 0 && $appStore.selectedLogIds.length === $logs.length);
  const someSelected = $derived($appStore.selectedLogIds.length > 0 && $appStore.selectedLogIds.length < $logs.length);
  
  // Format date for display
  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  // View log details (placeholder for Phase 2)
    function viewLogDetails(logId: string) {
    const log = $logs.find(l => l.id === logId);
    if (log) {
      selectedLog = log;
      isModalOpen = true;
    }
  }

  function closeModal() {
    isModalOpen = false;
    selectedLog = null;
  }
</script>

<div class="logs-table-container" data-testid="logs-table">
  <div class="table-header">
    <div class="table-title">
      <h3>Teacher Induction Logs</h3>
      <span class="log-count">{sortedLogs.length} {sortedLogs.length === 1 ? 'log' : 'logs'}</span>
    </div>
  </div>

  <div class="table-wrapper">
    <table class="logs-table">
      <thead>
        <tr>
          <th class="select-column">
            <input
              type="checkbox"
              checked={allSelected}
              indeterminate={someSelected}
              onchange={handleSelectAll}
              aria-label="Select all logs"
            />
          </th>
          {#if isColumnVisible('inductee')}
            <th class="sortable" onclick={() => handleSort('inductee')}>
              <span class="header-content">
                Inductee Name
                {#if sortColumn === 'inductee'}
                  <span class="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </span>
            </th>
          {/if}
          {#if isColumnVisible('building')}
            <th class="sortable" onclick={() => handleSort('building')}>
              <span class="header-content">
                Building
                {#if sortColumn === 'building'}
                  <span class="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </span>
            </th>
          {/if}
          {#if isColumnVisible('assignment')}
            <th class="sortable" onclick={() => handleSort('assignment')}>
              <span class="header-content">
                Assignment
                {#if sortColumn === 'assignment'}
                  <span class="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </span>
            </th>
          {/if}
          {#if isColumnVisible('schoolYear')}
            <th class="sortable" onclick={() => handleSort('schoolYear')}>
              <span class="header-content">
                School Year
                {#if sortColumn === 'schoolYear'}
                  <span class="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </span>
            </th>
          {/if}
          {#if isColumnVisible('status')}
            <th class="sortable" onclick={() => handleSort('status')}>
              <span class="header-content">
                Status
                {#if sortColumn === 'status'}
                  <span class="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </span>
            </th>
          {/if}
          {#if isColumnVisible('verificationCount')}
            <th class="sortable" onclick={() => handleSort('verifications')}>
              <span class="header-content">
                Verifications
                {#if sortColumn === 'verifications'}
                  <span class="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </span>
            </th>
          {/if}
          {#if isColumnVisible('lastModified')}
            <th class="sortable" onclick={() => handleSort('lastModified')}>
              <span class="header-content">
                Last Modified
                {#if sortColumn === 'lastModified'}
                  <span class="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </span>
            </th>
          {/if}
          {#if isColumnVisible('actions')}
            <th class="actions-column">Actions</th>
          {/if}
        </tr>
      </thead>
      <tbody>
        {#each sortedLogs as log (log.id)}
          <tr 
            class="log-row {$appStore.selectedLogIds.includes(log.id) ? 'selected' : ''}"
            data-log-id={log.id}
          >
            <td class="select-cell">
              <input
                type="checkbox"
                checked={$appStore.selectedLogIds.includes(log.id)}
                onchange={() => handleRowSelect(log.id)}
                aria-label="Select {log.data.inductee || 'this log'}"
              />
            </td>
            {#if isColumnVisible('inductee')}
              <td class="inductee-cell">
                <div class="inductee-info">
                  <span class="inductee-name">{log.data.inductee || 'Unnamed Inductee'}</span>
                  {#if log.data.mentorTeacher}
                    <span class="mentor-name">Mentor: {log.data.mentorTeacher}</span>
                  {/if}
                </div>
              </td>
            {/if}
            {#if isColumnVisible('building')}
              <td class="building-cell">{log.data.building || '—'}</td>
            {/if}
            {#if isColumnVisible('assignment')}
              <td class="assignment-cell">{log.data.assignment || '—'}</td>
            {/if}
            {#if isColumnVisible('schoolYear')}
              <td class="school-year-cell">{log.data.schoolYearOne || '—'}</td>
            {/if}
            {#if isColumnVisible('status')}
              {@const StatusIcon = getStatusIcon(log.completionStatus)}
              <td class="status-cell">
                <span class="status-badge {getStatusClass(log.completionStatus)}">
                  <span class="status-icon">
                    <StatusIcon size={14} />
                  </span>
                  {getStatusText(log.completionStatus)}
                </span>
              </td>
            {/if}
            {#if isColumnVisible('verificationCount')}
              <td class="verifications-cell">
                <div class="verification-info">
                  <span class="verification-count">{log.verificationCount}</span>
                  {#if log.missingVerifications.length > 0}
                    <span class="missing-count" title="Missing verifications: {log.missingVerifications.join(', ')}">
                      ({log.missingVerifications.length} missing)
                    </span>
                  {/if}
                </div>
              </td>
            {/if}
            {#if isColumnVisible('lastModified')}
              <td class="date-cell">{formatDate(log.lastModified)}</td>
            {/if}
            {#if isColumnVisible('actions')}
              <td class="actions-cell">
                <Button
                  onclick={() => viewLogDetails(log.id)}
                  variant="default"
                  compact={true}
                >
                  View
                </Button>
              </td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>

    {#if sortedLogs.length === 0}
      <div class="empty-table">
        <p>No logs to display</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .logs-table-container {
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }

  .table-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e0e0e0;
    background: #f9f9f9;
  }

  .table-title {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .table-title h3 {
    margin: 0;
    color: #333;
    font-size: 18px;
    font-weight: 600;
  }

  .log-count {
    color: #666;
    font-size: 14px;
    background: #e0e0e0;
    padding: 4px 8px;
    border-radius: 12px;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .logs-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .logs-table th,
  .logs-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  .logs-table th {
    background: #f5f5f5;
    font-weight: 600;
    color: #333;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .sortable {
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s ease;
  }

  .sortable:hover {
    background: #eeeeee;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .sort-icon {
    font-size: 12px;
    color: #4CAF50;
  }

  .select-column {
    width: 50px;
    text-align: center;
  }

  .actions-column {
    width: 100px;
    text-align: center;
  }

  .log-row {
    transition: background-color 0.2s ease;
  }

  .log-row:hover {
    background: #f9f9f9;
  }

  .log-row.selected {
    background: #e3f2fd;
  }

  .select-cell {
    text-align: center;
  }

  .inductee-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .inductee-name {
    font-weight: 600;
    color: #333;
  }

  .mentor-name {
    font-size: 12px;
    color: #666;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .status-complete {
    background: #e8f5e8;
    color: #2e7d32;
  }

  .status-pending {
    background: #fff3e0;
    color: #f57c00;
  }

  .status-incomplete {
    background: #ffebee;
    color: #c62828;
  }

  .status-unknown {
    background: #f5f5f5;
    color: #666;
  }

  .status-icon {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
  }
  
  .status-icon :global(svg) {
    fill: currentColor;
  }

  .verification-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .verification-count {
    font-weight: 600;
    color: #333;
  }

  .missing-count {
    font-size: 11px;
    color: #f57c00;
    cursor: help;
  }

  .actions-cell {
    text-align: center;
  }

  .empty-table {
    padding: 40px 20px;
    text-align: center;
    color: #666;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .table-wrapper {
      min-width: 800px;
    }

    .logs-table th,
    .logs-table td {
      padding: 8px 12px;
      font-size: 13px;
    }

    .table-header {
      padding: 16px 20px;
    }

    .inductee-info {
      min-width: 150px;
    }
  }

  /* Checkbox styling */
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #4CAF50;
  }

  input[type="checkbox"]:indeterminate {
    accent-color: #FF9800;
  }
</style>

<!-- LogDetailsModal -->
{#if selectedLog}
  <LogDetailsModal 
    log={selectedLog} 
    isOpen={isModalOpen} 
    onClose={closeModal} 
  />
{/if}
