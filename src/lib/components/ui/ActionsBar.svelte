<svelte:options customElement="ps-actions-bar" />

<script lang="ts">
  // Imports needed for button actions and notifications
  import { printForm, saveForm } from '../../stores/formStore';
  import { manualSave } from '../../stores/saveManager'; // Note: initializeAutoSave might need to be called elsewhere if still used
  import { writable } from 'svelte/store';
  import Button from './Button.svelte';
  import Notification from './Notification.svelte';
  import Printer from "carbon-icons-svelte/lib/Printer.svelte";
  import Save from "carbon-icons-svelte/lib/Save.svelte";

  // --- State for save notifications ---
  const showSaveNotification = writable(false);
  const notificationMessage = writable('');
  const notificationType = writable<'success' | 'info' | 'warning' | 'error'>('info');

  // --- Removed state and functions related to scroll effects ---
  // Removed: lastSaveTime, scrollY, scrollThreshold, onMount/onDestroy for listeners, 
  // handleScroll, handleStorageChange, reactive style calculations ($: opacity, etc.)

  // --- Manual Save Handler ---
  function handleSave() {
    console.log('[DEBUG] handleSave called');
    try {
      // Call original store save function
      saveForm();
      // Call save manager function (if used for local storage, etc.)
      manualSave();
      
      // Show success notification
      notificationMessage.set('Form saved successfully');
      notificationType.set('success');
      showSaveNotification.set(true);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        showSaveNotification.set(false);
      }, 3000);
      console.log('[DEBUG] handleSave success block executed');
    } catch (error) {
      console.log('[DEBUG] handleSave error block executed', error);
      console.error('Error saving form:', error);
      
      // Show error notification
      notificationMessage.set('Failed to save form');
      notificationType.set('error');
      showSaveNotification.set(true);
      // Error notifications currently hide after 3s too, adjust if needed
    }
  }
</script>

<div class="header-toolbar">
  <div class="toolbar-container">
    <div class="toolbar-content">
      
      <div class="title-block"> 
        <div class="district-title">TREDYFFRIN/EASTTOWN SCHOOL DISTRICT</div>
        <div class="separator">|</div>
        <div class="app-title">Teacher Induction Log</div>
      </div>
      
      <div class="action-buttons">
        <Button on:click={printForm} variant="default" compact={true}>
          <span class="icon"><Printer size={16} /></span> Print Form
        </Button>
        <Button on:click={handleSave} variant="default" compact={true}>
          <span class="icon"><Save size={16} /></span> Save Form
        </Button>
      </div>
    </div>
  </div>
</div>

{#if $showSaveNotification}
  <Notification 
    message={$notificationMessage} 
    type={$notificationType} 
    duration={3000} 
    position="top-right" 
  />
{/if}

<style>
  .header-toolbar {
  /* Sticky positioning */
  position: sticky; 
  /* CHANGE THIS LINE: */
  top: -1px; /* Adjust by -1px to counteract the 1px padding-top on #content-main */
  
  width: 100%; 
  z-index: 1000; 
  
  /* --- Static Solid Background Styles --- */
  background-color: #ffffff; 
  border-bottom: 1px solid #e0e0e0; 
  padding: 6px 0; 
  height: 48px;  
  box-sizing: border-box;
}
  
  .toolbar-container {
    max-width: 1400px; /* Match max-width of form-content */
    margin: 0 auto;
    padding: 0 20px; /* Match padding of form-content */
    width: 100%;
    box-sizing: border-box;
    height: 100%;
  }
  
  .toolbar-content {
    display: flex; 
    align-items: center; /* Vertically center items */
    justify-content: space-between; /* Push title left, buttons right */
    height: 100%;
    /* position: relative; */ /* Not needed if auto-save removed */
  }
  
  /* Title block - Always visible */
  .title-block {
    display: flex;
    align-items: center;
    opacity: 1; 
    flex-shrink: 0; /* Prevent title shrinking */
  }

  .district-title { font-weight: bold; font-size: 1.1rem; color: #333; white-space: nowrap; }
  .separator { margin: 0 10px; color: #666; }
  .app-title { font-weight: normal; font-size: 1.1rem; color: #333; white-space: nowrap; }
  
  /* Removed .auto-save-info styles */

  /* Action buttons - Aligned right */
  .action-buttons {
    display: flex;
    gap: 1rem; 
    /* No margin needed due to justify-content on parent */
  }

  .icon { 
    display: inline-flex; 
    align-items: center; 
    margin-right: 0.25rem; 
    vertical-align: middle; 
  }
  .icon :global(svg) { 
    fill: currentColor; 
  }
  
  /* --- Print and Responsive Styles --- */
  @media print { 
    .header-toolbar { 
      display: none; 
    } 
  }
  
  @media screen and (max-width: 767px) {
    .toolbar-container { padding: 0 10px; }
    .district-title { font-size: 0.95rem; }
    .app-title { display: none; } /* Hide app title on smaller screens */
    .action-buttons { gap: 0.5rem; } /* Reduce gap */
  }
  
  @media screen and (max-width: 480px) {
    .district-title { font-size: 0.85rem; }
    .separator { display: none; } /* Hide separator */
    /* Optionally hide button text, show only icons */
     .action-buttons button span:not(.icon) { 
       /* display: none;  */ /* Uncomment to hide text */
     }
     .action-buttons button .icon {
        /* margin-right: 0; */ /* Uncomment if text hidden */
     }
     .action-buttons button {
       /* padding: 0.5rem; */ /* Adjust padding if text hidden */
     }
  }

</style>