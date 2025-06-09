<script lang="ts">
  import { onMount } from 'svelte';
  
  // Define mentor dashboard specific data types
  interface Mentee {
    id: string;
    name: string;
    building: string;
    assignment: string;
    schoolYear: string;
    logStatus: 'incomplete' | 'complete' | 'pending-review';
    lastModified: string;
  }

  interface MentorDashboardData {
    mentorName: string;
    mentees: Mentee[];
    summaryStats: {
      totalMentees: number;
      completedLogs: number;
      pendingReviews: number;
    };
  }

  // Component state
  let dashboardData: MentorDashboardData | null = $state(null);
  let loading = $state(true);
  let error = $state(false);
  let errorMessage = $state('');

  // Filter state
  let buildingFilter = $state('all');
  let statusFilter = $state('all');
  let sortBy = $state('name');

  // Load mentee data for the mentor
  async function loadMenteeData() {
    loading = true;
    error = false;
    
    try {
      // Determine the config URL based on current location
      const pathname = window.location.pathname;
      const baseUrl = window.location.origin;
      let configUrl = '';
      
      if (pathname.includes('/teachers/mentor-dashboard/')) {
        configUrl = `${baseUrl}/teachers/mentor-dashboard/mentees.json`;
      } else {
        // Fallback for development
        configUrl = `${import.meta.env.BASE_URL}mentor-dashboard-data.json`;
      }
      
      console.log('Fetching mentor dashboard data from:', configUrl);
      const response = await fetch(configUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch mentee data: ${response.status} ${response.statusText}`);
      }
      
      dashboardData = await response.json();
      console.log('Loaded mentor dashboard data:', dashboardData);
    } catch (err) {
      error = true;
      errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error loading mentor dashboard data:', err);
    } finally {
      loading = false;
    }
  }

  // Filter and sort mentees
  function getFilteredMentees(): Mentee[] {
    if (!dashboardData) return [];
    
    let filtered = dashboardData.mentees.filter(mentee => {
      const buildingMatch = buildingFilter === 'all' || mentee.building === buildingFilter;
      const statusMatch = statusFilter === 'all' || mentee.logStatus === statusFilter;
      return buildingMatch && statusMatch;
    });
    
    // Sort mentees
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'building':
          return a.building.localeCompare(b.building);
        case 'status':
          return a.logStatus.localeCompare(b.logStatus);
        case 'lastModified':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        default:
          return 0;
      }
    });
    
    return filtered;
  }

  // Get unique buildings for filter dropdown
  function getBuildings(): string[] {
    if (!dashboardData) return [];
    const buildings = [...new Set(dashboardData.mentees.map(m => m.building))];
    return buildings.sort();
  }

  // Navigate to mentee's induction log
  function viewMenteeLog(menteeId: string) {
    const baseUrl = window.location.origin;
    const menteeLogUrl = `${baseUrl}/teacher-induction-log/?mentee=${menteeId}&view=mentor`;
    window.location.href = menteeLogUrl;
  }

  // Get status display text and class
  function getStatusInfo(status: string) {
    switch (status) {
      case 'complete':
        return { text: 'Complete', class: 'status-complete' };
      case 'pending-review':
        return { text: 'Pending Review', class: 'status-pending' };
      case 'incomplete':
      default:
        return { text: 'Incomplete', class: 'status-incomplete' };
    }
  }

  // Format date for display
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  // Load data on component mount
  onMount(() => {
    loadMenteeData();
  });

  // Reactive filtered mentees using Svelte 5 runes
  const filteredMentees = $derived(getFilteredMentees());
  const availableBuildings = $derived(getBuildings());
</script>

<svelte:options customElement="mentor-dashboard-app" />

<div class="mentor-dashboard" data-testid="mentor-dashboard">
  <div class="dashboard-header">
    <h1>Mentor Dashboard</h1>
    {#if dashboardData}
      <p class="mentor-name">Welcome, {dashboardData.mentorName}</p>
    {/if}
  </div>

  {#if loading}
    <div class="loading-container">
      <p>Loading mentor dashboard...</p>
    </div>
  {:else if error}
    <div class="error-container">
      <p class="error-message">Error loading dashboard: {errorMessage}</p>
      <button onclick={() => loadMenteeData()} class="retry-button">Retry</button>
    </div>
  {:else if dashboardData}
    <!-- Summary Statistics -->
    <div class="summary-stats">
      <div class="stat-card">
        <h3>{dashboardData.summaryStats.totalMentees}</h3>
        <p>Total Mentees</p>
      </div>
      <div class="stat-card">
        <h3>{dashboardData.summaryStats.completedLogs}</h3>
        <p>Completed Logs</p>
      </div>
      <div class="stat-card">
        <h3>{dashboardData.summaryStats.pendingReviews}</h3>
        <p>Pending Reviews</p>
      </div>
    </div>

    <!-- Filters and Controls -->
    <div class="dashboard-controls">
      <div class="filter-group">
        <label for="building-filter">Building:</label>
        <select id="building-filter" bind:value={buildingFilter}>
          <option value="all">All Buildings</option>
          {#each availableBuildings as building}
            <option value={building}>{building}</option>
          {/each}
        </select>
      </div>

      <div class="filter-group">
        <label for="status-filter">Status:</label>
        <select id="status-filter" bind:value={statusFilter}>
          <option value="all">All Statuses</option>
          <option value="incomplete">Incomplete</option>
          <option value="complete">Complete</option>
          <option value="pending-review">Pending Review</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="sort-by">Sort by:</label>
        <select id="sort-by" bind:value={sortBy}>
          <option value="name">Name</option>
          <option value="building">Building</option>
          <option value="status">Status</option>
          <option value="lastModified">Last Modified</option>
        </select>
      </div>
    </div>

    <!-- Mentees Grid -->
    <div class="mentees-grid">
      {#each filteredMentees as mentee (mentee.id)}
        <div class="mentee-card">
          <div class="mentee-header">
            <h3 class="mentee-name">{mentee.name}</h3>
            <span class="status-badge {getStatusInfo(mentee.logStatus).class}">
              {getStatusInfo(mentee.logStatus).text}
            </span>
          </div>
          
          <div class="mentee-details">
            <p><strong>Building:</strong> {mentee.building}</p>
            <p><strong>Assignment:</strong> {mentee.assignment}</p>
            <p><strong>School Year:</strong> {mentee.schoolYear}</p>
            <p><strong>Last Modified:</strong> {formatDate(mentee.lastModified)}</p>
          </div>
          
          <div class="mentee-actions">
            <button 
              onclick={() => viewMenteeLog(mentee.id)} 
              class="view-log-button"
            >
              View Induction Log
            </button>
          </div>
        </div>
      {/each}
    </div>

    {#if filteredMentees.length === 0}
      <div class="no-mentees">
        <p>No mentees match the current filters.</p>
      </div>
    {/if}
  {:else}
    <div class="error-container">
      <p>Unable to load mentor dashboard data.</p>
    </div>
  {/if}
</div>

<style>
  .mentor-dashboard {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
    color: var(--text-color, #333);
  }

  .dashboard-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--table-border, #ddd);
  }

  .dashboard-header h1 {
    color: var(--primary-color, #007bff);
    margin: 0;
    font-size: 2.5rem;
  }

  .mentor-name {
    color: var(--secondary-color, #6c757d);
    font-size: 1.2rem;
    margin: 0.5rem 0 0 0;
  }

  .loading-container,
  .error-container {
    text-align: center;
    padding: 3rem;
  }

  .error-message {
    color: var(--danger-color, #dc3545);
    margin-bottom: 1rem;
  }

  .retry-button {
    background-color: var(--primary-color, #007bff);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  .retry-button:hover {
    background-color: var(--primary-color-hover, #0056b3);
  }

  /* Summary Statistics */
  .summary-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background-color: var(--light-color, #f8f9fa);
    border: 1px solid var(--table-border, #ddd);
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .stat-card h3 {
    font-size: 2rem;
    margin: 0;
    color: var(--primary-color, #007bff);
  }

  .stat-card p {
    margin: 0.5rem 0 0 0;
    color: var(--secondary-color, #6c757d);
    font-weight: 500;
  }

  /* Dashboard Controls */
  .dashboard-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background-color: var(--light-color, #f8f9fa);
    border-radius: 8px;
    border: 1px solid var(--table-border, #ddd);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    min-width: 150px;
  }

  .filter-group label {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: var(--text-color, #333);
  }

  .filter-group select {
    padding: 0.5rem;
    border: 1px solid var(--input-border, #ccc);
    border-radius: 4px;
    font-size: 1rem;
    background-color: white;
  }

  .filter-group select:focus {
    outline: none;
    border-color: var(--focus-color, #007bff);
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  /* Mentees Grid */
  .mentees-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .mentee-card {
    background-color: white;
    border: 1px solid var(--table-border, #ddd);
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease;
  }

  .mentee-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .mentee-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  .mentee-name {
    margin: 0;
    color: var(--text-color, #333);
    font-size: 1.25rem;
    flex: 1;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .status-complete {
    background-color: var(--success-color, #28a745);
    color: white;
  }

  .status-pending {
    background-color: var(--warning-color, #ffc107);
    color: var(--dark-color, #343a40);
  }

  .status-incomplete {
    background-color: var(--danger-color, #dc3545);
    color: white;
  }

  .mentee-details {
    margin-bottom: 1.5rem;
  }

  .mentee-details p {
    margin: 0.5rem 0;
    color: var(--text-color, #333);
  }

  .mentee-details strong {
    color: var(--dark-color, #343a40);
  }

  .mentee-actions {
    text-align: center;
  }

  .view-log-button {
    background-color: var(--primary-color, #007bff);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    width: 100%;
    transition: background-color 0.2s ease;
  }

  .view-log-button:hover {
    background-color: var(--primary-color-hover, #0056b3);
  }

  .view-log-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .no-mentees {
    text-align: center;
    padding: 3rem;
    color: var(--secondary-color, #6c757d);
    font-style: italic;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .mentor-dashboard {
      padding: 1rem;
    }

    .dashboard-header h1 {
      font-size: 2rem;
    }

    .dashboard-controls {
      flex-direction: column;
    }

    .filter-group {
      min-width: auto;
    }

    .mentees-grid {
      grid-template-columns: 1fr;
    }

    .mentee-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .status-badge {
      align-self: flex-start;
    }
  }

  /* Print Styles */
  @media print {
    .mentor-dashboard {
      padding: 0;
    }

    .dashboard-controls {
      display: none;
    }

    .mentee-card {
      break-inside: avoid;
      box-shadow: none;
      border: 1px solid #ccc;
    }

    .view-log-button {
      display: none;
    }
  }
</style>
