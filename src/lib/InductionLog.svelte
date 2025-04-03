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
        <GenericSection config={sectionConfig} />
      {/each}
      <Signatures />
      <VerificationNote />
    </div>
  </div>
</div>

<style>
  /* General styles */
  .induction-log {
    max-width: 1200px;
    width: 94%;
    margin: 0 auto;
    padding: 20px 0;
    box-sizing: border-box;
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fbca28;
  }
  
  .form-container {
    width: 100%;
    background-color: transparent;
    border-radius: 10px;
    padding: 0;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .log-content {
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  /* Print-specific styles */
  @media print {
    .induction-log {
      padding: 0;
      max-width: 100%;
      width: 100%;
    }
    
    .form-container {
      background-color: transparent;
      box-shadow: none;
      padding: 0;
    }
  }
  
  /* Responsive adjustments */
  @media screen and (max-width: 768px) {
    .induction-log {
      width: 98%;
      padding: 10px 0;
    }
  }
</style>
