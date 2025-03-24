<script lang="ts">
  // Import section components
  import CoverPage from './components/sections/CoverPage.svelte';
  import GenericSection from './components/sections/GenericSection.svelte';
  import Signatures from './components/sections/Signatures.svelte';
  import VerificationNote from './components/sections/VerificationNote.svelte';
  
  // Import UI components
  import ActionsBar from './components/ui/ActionsBar.svelte';
  
  // Import section configurations
  import { sectionConfigs } from './config/sectionConfigs';
  
  // Import form store and types
  import { formConfigStore, formStore, setFormConfig, type FormConfig } from './stores/formStore';
  
  // Props: form configuration can be passed in from parent component
  export let config: FormConfig | undefined = undefined;
  
  // Initialize the form configuration if provided
  if (config) {
    setFormConfig(config);
  }
</script>

<div class="induction-log">
  <ActionsBar />
  
  <div class="form-container">
    <CoverPage />
    
    <div class="log-content">
      {#each sectionConfigs as sectionConfig}
        <div class="form-section">
          <GenericSection config={sectionConfig} />
        </div>
      {/each}
      <div class="form-section">
        <Signatures />
      </div>
      <VerificationNote />
    </div>
  </div>
</div>

<style>
  /* General styles */
  .induction-log {
    font-family: 'Open Sans', sans-serif;
    max-width: 95%;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    line-height: 1.6;
    color: var(--text-color);
  }
  
  .form-container {
    background-color: rgba(255, 255, 255, 0.92);
    border-radius: 10px;
    padding: 2.5rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.06);
    margin-bottom: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  .log-content {
    margin-top: 2rem;
  }
  
  /* Container for the entire form */
  :global(.form-section) {
    margin-bottom: 2rem;
  }
  
  /* Table specific styling to ensure consistent widths */
  :global(table) {
    table-layout: fixed;
  }
  
  :global(th), :global(td) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* Print-specific styles */
  @media print {
    .induction-log {
      padding: 0;
      max-width: 100%;
    }
    
    .form-container {
      background-color: transparent;
      box-shadow: none;
      padding: 0;
    }
  }
</style>