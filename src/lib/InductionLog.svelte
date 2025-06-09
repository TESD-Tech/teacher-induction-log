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
  
  // Import form store to access mentee data
  import { formStore } from './stores/formStore';
  // context7: All imports are explicit, and the #each block is keyed for best practice.

  // Svelte 5: Accept userType as a prop
  let { userType } = $props();
  
  // Check if we're in mentor view mode
  const urlParams = new URLSearchParams(window.location.search);
  const isMentorView = urlParams.get('view') === 'mentor';
  const menteeId = urlParams.get('mentee');
  
  function backToDashboard() {
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/teacher-induction-log/teachers/mentor-dashboard/mentor-dashboard.html`;
  }
</script>

<div class="induction-log" data-testid="induction-log">
  <ActionsBar />
  
  {#if isMentorView}
    <div class="mentor-navigation">
      <button type="button" class="back-to-dashboard" onclick={backToDashboard}>
        ← Back to Mentor Dashboard
      </button>
      <div class="mentee-info">
        Viewing log for mentee: {$formStore.inductee || menteeId}
      </div>
    </div>
  {/if}
  
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
  
  .mentor-navigation {
    background: linear-gradient(135deg, #2c3e50, #3498db);
    color: white;
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .back-to-dashboard {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
  }
  
  .back-to-dashboard:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .mentee-info {
    font-size: 14px;
    opacity: 0.9;
  }
</style>