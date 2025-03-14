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
  
  <CoverPage />
  
  <div class="log-content">
    {#each sectionConfigs as sectionConfig}
      <GenericSection config={sectionConfig} />
    {/each}
    <Signatures />
    <VerificationNote />
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
    line-height: 1.5;
  }
  
  /* Print-specific styles */
  @media print {
    .induction-log {
      padding: 0;
    }
  }
</style>