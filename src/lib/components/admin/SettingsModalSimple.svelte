<svelte:options customElement="ps-settings-modal-simple" />

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
  let settings = $state<AdminSettings>($settingsStore);

  // Update local settings when store changes
  $effect(() => {
    settings = $settingsStore;
  });

  // Handle section toggle
  function toggleSection(section: keyof AdminSettings['sections']) {
    settingsStore.updateSection(section, !settings.sections[section]);
  }

  // Handle backdrop click
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }
</script>

{#if open}
  <div 
    class="modal-backdrop" 
    onclick={handleBackdropClick}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
    role="dialog"
    aria-modal="true"
    aria-labelledby="settings-modal-title"
    tabindex="0"
  >
    <div class="modal-content" role="document">
      <div class="modal-header">
        <h2 id="settings-modal-title" class="modal-title">Admin Panel Settings</h2>
        <button class="modal-close" onclick={onClose}>×</button>
      </div>

      <div class="modal-body">
        <div class="section-header">
          <h3 class="section-title">Section Visibility</h3>
          <p class="section-subtitle">Choose which sections to display in the admin panel</p>
        </div>
        
        <div class="settings-grid">
          <label class="setting-item">
            <input 
              type="checkbox" 
              checked={settings.sections.dashboard}
              onchange={() => toggleSection('dashboard')}
              class="setting-checkbox"
            />
            <div class="setting-content">
              <div class="setting-label">📈 Statistics Dashboard</div>
              <div class="setting-description">Overview cards with key metrics</div>
            </div>
          </label>

          <label class="setting-item">
            <input 
              type="checkbox" 
              checked={settings.sections.quickSearch}
              onchange={() => toggleSection('quickSearch')}
              class="setting-checkbox"
            />
            <div class="setting-content">
              <div class="setting-label">🔍 Quick Search</div>
              <div class="setting-description">Search bar and basic filters</div>
            </div>
          </label>

          <label class="setting-item">
            <input 
              type="checkbox" 
              checked={settings.sections.advancedFilters}
              onchange={() => toggleSection('advancedFilters')}
              class="setting-checkbox"
            />
            <div class="setting-content">
              <div class="setting-label">🎯 Advanced Filters</div>
              <div class="setting-description">Detailed filtering options</div>
            </div>
          </label>

          <label class="setting-item">
            <input 
              type="checkbox" 
              checked={settings.sections.bulkActions}
              onchange={() => toggleSection('bulkActions')}
              class="setting-checkbox"
            />
            <div class="setting-content">
              <div class="setting-label">⚡ Bulk Actions</div>
              <div class="setting-description">Multi-select operations</div>
            </div>
          </label>
        </div>

        <div class="modal-footer">
          <Button onclick={onClose} variant="default">Close</Button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Modal Backdrop and Layout */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 1rem;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    max-width: 48rem;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Modal Header */
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #16a34a;
    margin: 0;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
    transition: color 0.2s ease;
  }

  .modal-close:hover {
    color: #4b5563;
  }

  /* Modal Body */
  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
  }

  .section-header {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.5rem 0;
  }

  .section-subtitle {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
  }

  .settings-grid {
    display: grid;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .setting-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .setting-item:hover {
    border-color: #bbf7d0;
    background: #f0fdf4;
  }

  .setting-checkbox {
    margin-top: 0.25rem;
    width: 1rem;
    height: 1rem;
    accent-color: #16a34a;
    cursor: pointer;
  }

  .setting-content {
    flex: 1;
  }

  .setting-label {
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .setting-description {
    font-size: 0.875rem;
    color: #6b7280;
  }

  /* Modal Footer */
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 0.5rem;
    }

    .modal-content {
      max-height: 95vh;
    }

    .modal-header {
      padding: 1rem;
    }

    .modal-body {
      padding: 1rem;
    }
  }
</style>
