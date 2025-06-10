<script lang="ts">
  import { adminStats } from '../../stores/adminStore';

  // Get the stats store
  const stats = adminStats;

  // Reactive calculations for display
  $: completionRateColor = $stats.completionRate >= 80 ? '#4CAF50' : 
                          $stats.completionRate >= 60 ? '#FF9800' : '#f44336';
</script>

<div class="dashboard" data-testid="admin-dashboard">
  <div class="dashboard-header">
    <h2>Overview Statistics</h2>
    <small>Real-time data from all teacher induction logs</small>
  </div>

  <div class="stats-grid">
    <!-- Total Logs -->
    <div class="stat-card total">
      <div class="stat-icon">📊</div>
      <div class="stat-content">
        <div class="stat-number">{$stats.total}</div>
        <div class="stat-label">Total Logs</div>
      </div>
    </div>

    <!-- Complete Logs -->
    <div class="stat-card complete">
      <div class="stat-icon">✅</div>
      <div class="stat-content">
        <div class="stat-number">{$stats.complete}</div>
        <div class="stat-label">Complete</div>
      </div>
    </div>

    <!-- Pending Logs -->
    <div class="stat-card pending">
      <div class="stat-icon">⏳</div>
      <div class="stat-content">
        <div class="stat-number">{$stats.pending}</div>
        <div class="stat-label">Pending Review</div>
      </div>
    </div>

    <!-- Incomplete Logs -->
    <div class="stat-card incomplete">
      <div class="stat-icon">❌</div>
      <div class="stat-content">
        <div class="stat-number">{$stats.incomplete}</div>
        <div class="stat-label">Incomplete</div>
      </div>
    </div>

    <!-- Completion Rate -->
    <div class="stat-card completion">
      <div class="stat-icon">📈</div>
      <div class="stat-content">
        <div class="stat-number" style="color: {completionRateColor}">
          {$stats.completionRate}%
        </div>
        <div class="stat-label">Completion Rate</div>
      </div>
    </div>

    <!-- Total Verifications -->
    <div class="stat-card verifications">
      <div class="stat-icon">🔍</div>
      <div class="stat-content">
        <div class="stat-number">{$stats.totalVerifications}</div>
        <div class="stat-label">Total Verifications</div>
        <div class="stat-sublabel">Avg: {$stats.averageVerifications} per log</div>
      </div>
    </div>
  </div>

  <!-- Progress Bar -->
  <div class="progress-section">
    <div class="progress-header">
      <span>Overall Progress</span>
      <span>{$stats.completionRate}% Complete</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        style="width: {$stats.completionRate}%; background-color: {completionRateColor}"
      ></div>
    </div>
    <div class="progress-legend">
      <div class="legend-item complete">
        <div class="legend-color"></div>
        <span>Complete ({$stats.complete})</span>
      </div>
      <div class="legend-item pending">
        <div class="legend-color"></div>
        <span>Pending ({$stats.pending})</span>
      </div>
      <div class="legend-item incomplete">
        <div class="legend-color"></div>
        <span>Incomplete ({$stats.incomplete})</span>
      </div>
    </div>
  </div>
</div>

<style>
  .dashboard {
    margin-bottom: 24px;
    padding: 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .dashboard-header {
    margin-bottom: 24px;
  }

  .dashboard-header h2 {
    margin: 0 0 4px 0;
    color: #2e7d32;
    font-size: 20px;
    font-weight: 600;
  }

  .dashboard-header small {
    color: #666;
    font-size: 14px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid;
    background: #f9f9f9;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .stat-card.total {
    border-left-color: #2196f3;
  }

  .stat-card.complete {
    border-left-color: #4CAF50;
  }

  .stat-card.pending {
    border-left-color: #FF9800;
  }

  .stat-card.incomplete {
    border-left-color: #f44336;
  }

  .stat-card.completion {
    border-left-color: #9C27B0;
  }

  .stat-card.verifications {
    border-left-color: #607D8B;
  }

  .stat-icon {
    font-size: 24px;
    opacity: 0.8;
  }

  .stat-content {
    flex: 1;
  }

  .stat-number {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    line-height: 1;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }

  .stat-sublabel {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
  }

  .progress-section {
    border-top: 1px solid #e0e0e0;
    padding-top: 24px;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 600;
    color: #333;
  }

  .progress-bar {
    width: 100%;
    height: 12px;
    background: #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .progress-fill {
    height: 100%;
    transition: width 0.3s ease;
    border-radius: 6px;
  }

  .progress-legend {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #666;
  }

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .legend-item.complete .legend-color {
    background: #4CAF50;
  }

  .legend-item.pending .legend-color {
    background: #FF9800;
  }

  .legend-item.incomplete .legend-color {
    background: #f44336;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .stat-card {
      padding: 16px;
    }

    .stat-number {
      font-size: 20px;
    }

    .progress-legend {
      gap: 16px;
    }

    .progress-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }

  @media (max-width: 480px) {
    .dashboard {
      padding: 16px;
    }

    .progress-legend {
      flex-direction: column;
      gap: 8px;
    }
  }
</style>
