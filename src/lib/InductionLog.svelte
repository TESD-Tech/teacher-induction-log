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
  // context7: All imports are explicit, and the #each block is keyed for best practice.

  // Svelte 5: Accept userType as a prop
  let { userType } = $props();
</script>

<div class="induction-log" data-testid="induction-log">
  <ActionsBar />
  
  <div class="form-content">
    <div class="form-container">
      <CoverPage userType={userType} />
      
      <div class="log-content">
        {#each sectionConfigs as sectionConfig (sectionConfig.id)}
          <GenericSection config={sectionConfig} userType={userType} /> 
        {/each}
        <Signatures userType={userType} />
        <VerificationNote userType={userType} />
      </div>
    </div>
  </div>
</div>

<style>
  /* Styles remain unchanged */
  /* ... */
  .induction-log {
    width: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    background-color: #fbca28;
  }
  
  .form-content {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    padding-top: 65px; /* Increased top padding to account for fixed header */
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
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
    
    .form-content {
      padding: 0;
    }
    
    .form-container {
      background-color: transparent;
      box-shadow: none;
      padding: 0;
    }
  }
  
  /* Responsive adjustments */
  @media screen and (max-width: 768px) {
    .form-content {
      padding: 10px;
      padding-top: 58px; /* Increased padding for the mobile header */
    }
  }
</style>