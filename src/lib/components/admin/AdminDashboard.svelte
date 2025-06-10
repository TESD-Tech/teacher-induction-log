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
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0;
    overflow: hidden;
  }

  .dashboard-header {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 1.5rem;
    border-bottom: 1px solid #e1e5e9;
  }

  .dashboard-header h2 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #2c3e50, #3498db);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dashboard-header small {
    color: #6c757d;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border-radius: 12px;
    border-left: 5px solid;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
    border-radius: 0 12px 0 50px;
  }

  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .stat-card.total {
    border-left-color: #3498db;
    background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%);
  }

  .stat-card.complete {
    border-left-color: #27ae60;
    background: linear-gradient(135deg, #ffffff 0%, #e8f5e8 100%);
  }

  .stat-card.pending {
    border-left-color: #f39c12;
    background: linear-gradient(135deg, #ffffff 0%, #fff3e0 100%);
  }

  .stat-card.incomplete {
    border-left-color: #e74c3c;
    background: linear-gradient(135deg, #ffffff 0%, #ffebee 100%);
  }

  .stat-card.completion {
    border-left-color: #9b59b6;
    background: linear-gradient(135deg, #ffffff 0%, #f3e5f5 100%);
  }

  .stat-card.verifications {
    border-left-color: #34495e;
    background: linear-gradient(135deg, #ffffff 0%, #eceff1 100%);
  }

  .stat-icon {
    font-size: 2rem;
    opacity: 0.8;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .stat-content {
    flex: 1;
    z-index: 1;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 800;
    color: #2c3e50;
    line-height: 1;
    margin-bottom: 0.5rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .stat-label {
    font-size: 0.9rem;
    color: #5a6c7d;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-sublabel {
    font-size: 0.8rem;
    color: #7b8794;
    margin-top: 0.25rem;
    font-style: italic;
  }

  .progress-section {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 1.5rem;
    border-top: 1px solid #e1e5e9;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-weight: 700;
    color: #2c3e50;
    font-size: 1.1rem;
  }

  .progress-bar {
    width: 100%;
    height: 16px;
    background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1.25rem;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .progress-fill {
    height: 100%;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 12px;
    background: linear-gradient(135deg, currentColor 0%, color-mix(in srgb, currentColor 80%, white) 100%);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
  }

  .progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      transparent 25%, 
      rgba(255, 255, 255, 0.2) 25%, 
      rgba(255, 255, 255, 0.2) 50%, 
      transparent 50%, 
      transparent 75%, 
      rgba(255, 255, 255, 0.2) 75%);
    background-size: 20px 20px;
    animation: move-stripes 2s linear infinite;
  }

  @keyframes move-stripes {
    0% { background-position: 0 0; }
    100% { background-position: 20px 0; }
  }

  .progress-legend {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: #495057;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.7);
    transition: all 0.2s ease;
  }

  .legend-item:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }

  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .legend-item.complete .legend-color {
    background: linear-gradient(135deg, #27ae60, #2ecc71);
  }

  .legend-item.pending .legend-color {
    background: linear-gradient(135deg, #f39c12, #f1c40f);
  }

  .legend-item.incomplete .legend-color {
    background: linear-gradient(135deg, #e74c3c, #ec7063);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
      padding: 1rem;
    }

    .dashboard-header {
      padding: 1rem;
    }

    .stat-card {
      padding: 1.25rem;
    }

    .stat-number {
      font-size: 1.75rem;
    }

    .progress-section {
      padding: 1rem;
    }

    .progress-legend {
      gap: 1rem;
      flex-direction: column;
      align-items: center;
    }

    .progress-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      text-align: left;
    }
  }

  @media (max-width: 480px) {
    .legend-item {
      padding: 0.375rem 0.75rem;
      font-size: 0.8rem;
    }

    .stat-icon {
      font-size: 1.5rem;
    }

    .stat-number {
      font-size: 1.5rem;
    }
  }
</style>
