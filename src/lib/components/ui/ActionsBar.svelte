<svelte:options customElement="ps-actions-bar" />

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { printForm, saveForm } from '../../stores/formStore';
  import { manualSave, initializeAutoSave } from '../../stores/saveManager';
  import { writable } from 'svelte/store';
  import Button from './Button.svelte';
  import Notification from './Notification.svelte';
  import Printer from "carbon-icons-svelte/lib/Printer.svelte";
  import Save from "carbon-icons-svelte/lib/Save.svelte";

  const showSaveNotification = writable(false);
  const notificationMessage = writable('');
  const notificationType = writable<'success' | 'info' | 'warning' | 'error'>('info');
  let lastSaveTime = '';
  let scrollY = 0;
  let scrollThreshold = 50; 

  onMount(() => {
    initializeAutoSave();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('scroll', handleScroll);
    scrollY = window.scrollY; 
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('scroll', handleScroll);
    };
  });

  function handleScroll() { 
    console.log(scrollY)
    scrollY = window.scrollY; }

  function handleSave() {
    // ... (handleSave logic remains the same) ...
    console.log('[DEBUG] handleSave called');
    try {
      saveForm();
      manualSave();
      lastSaveTime = new Date().toLocaleTimeString();
      notificationMessage.set('Form saved successfully');
      notificationType.set('success');
      showSaveNotification.set(true);
      setTimeout(() => showSaveNotification.set(false), 3000);
      console.log('[DEBUG] handleSave success block executed');
    } catch (error) {
      console.log('[DEBUG] handleSave error block executed', error);
      console.error('Error saving form:', error);
      notificationMessage.set('Failed to save form');
      notificationType.set('error');
      showSaveNotification.set(true);
    }
  }

  function handleStorageChange(event: StorageEvent) {
    // ... (handleStorageChange logic remains the same) ...
    console.log('[DEBUG] handleStorageChange called', event);
    if (event.key === 'teacher-induction-log-data') {
      lastSaveTime = new Date().toLocaleTimeString();
      notificationMessage.set('Form data auto-saved: ' + lastSaveTime);
      notificationType.set('info');
      showSaveNotification.set(true);
      setTimeout(() => showSaveNotification.set(false), 2000);
    }
  }

  // Keep background/shadow effects based on scroll
  $: opacity = Math.min(scrollY / scrollThreshold, 0.95);
  $: shadowOpacity = Math.min(scrollY / scrollThreshold, 0.15);
  $: toolbarStyle = `
    background-color: rgba(255, 255, 255, ${opacity});
    box-shadow: 0 ${shadowOpacity * 8}px ${shadowOpacity * 16}px rgba(0, 0, 0, ${shadowOpacity});
    border-bottom: ${scrollY > 10 ? '1px solid rgba(224, 224, 224, 0.5)' : 'none'};
  `;

  $: autoSaveOpacityValue = 0.5 + opacity * 0.5;

  // REMOVED: Scroll-based conditional visibility logic for title
  // $: showTitle = scrollY > 50; 
  
  // Keep compact/full if used for padding/height adjustment
  $: headerStyle = scrollY > 180 ? 'compact' : 'full'; 
</script>

<div class="header-toolbar {headerStyle}" style="{toolbarStyle}">
  <div class="toolbar-container">
    <div class="toolbar-content">
      
      <div class="title-block"> 
        <div class="district-title">TREDYFFRIN/EASTTOWN SCHOOL DISTRICT</div>
        <div class="separator">|</div>
        <div class="app-title">Teacher Induction Log</div>
      </div>
      
      <div 
        class="auto-save-info" 
        style:--auto-save-opacity={autoSaveOpacityValue}
      >
        {#if lastSaveTime}
          <span class="last-saved">Last saved: {lastSaveTime}</span>
        {/if}
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
    position: sticky; 
    top: 0; 
    width: 100%; 
    z-index: 1000; 
    transition: background-color 0.3s ease, box-shadow 0.3s ease, border-bottom 0.3s ease; /* Adjusted transition */
    backdrop-filter: blur(10px); 
    -webkit-backdrop-filter: blur(10px);
  }

  .header-toolbar.full { padding: 6px 0; height: 48px; }
  .header-toolbar.compact { padding: 4px 0; height: 48px; }
  
  .toolbar-container {
    max-width: 1400px; margin: 0 auto; padding: 0 20px; width: 100%; box-sizing: border-box; height: 100%;
  }
  
  .toolbar-content {
    display: flex; 
    align-items: center; /* Vertically center items */
    height: 100%;
    position: relative; /* Needed for absolute positioning of auto-save */
  }
  
  /* Title block - Now always visible */
  .title-block {
    /* REMOVED: position: absolute */
    display: flex;
    align-items: center;
    opacity: 1; /* Always visible */
    /* REMOVED: transform, transition, pointer-events */
    /* Add some margin to the right if needed */
    /* margin-right: auto; */ /* Pushes other content right */
    flex-shrink: 0; /* Prevent shrinking if space is tight */
  }

  /* REMOVED: .title-block.visible rule */

  .district-title { font-weight: bold; font-size: 1.1rem; color: #333; white-space: nowrap; }
  .separator { margin: 0 10px; color: #666; }
  .app-title { font-weight: normal; font-size: 1.1rem; color: #333; white-space: nowrap; }
  
  /* Auto-save info - keep centered */
  .auto-save-info {
    font-size: 0.85rem; color: #444; font-style: italic;
    position: absolute; /* Keep absolute to center easily */
    left: 50%;
    transform: translateX(-50%);
    opacity: var(--auto-save-opacity, 0.5); /* Use variable, fallback to 0.5 */
    transition: opacity 0.3s ease;
    text-align: center; /* Ensure text inside is centered */
    white-space: nowrap; /* Prevent wrapping */
  }
  
  .last-saved { display: inline-block; padding: 3px 8px; background: rgba(255, 255, 255, 0.7); border-radius: 4px; border: 1px solid rgba(224, 224, 224, 0.5); }

  /* Action buttons - push to the right */
  .action-buttons {
    display: flex;
    gap: 1rem; 
    margin-left: auto; /* Push to the far right */
  }

  .icon { display: inline-flex; align-items: center; margin-right: 0.25rem; vertical-align: middle; }
  .icon :global(svg) { fill: currentColor; }
  
  @media print { .header-toolbar { display: none; } }

  /* Responsive adjustments - Ensure title doesn't overlap buttons */
  @media screen and (max-width: 992px) { /* Example breakpoint */
    .auto-save-info {
       /* Maybe hide or move auto-save earlier if title needs space */
       /* display: none; */ 
    }
  }

  @media screen and (max-width: 767px) {
    .toolbar-container { padding: 0 10px; }
    /* Further adjust title/auto-save/buttons if needed */
    .district-title { font-size: 0.95rem; }
    .separator { margin: 0 5px; }
    .app-title { display: none; } /* Hide app title earlier */
    .auto-save-info { display: none; } /* Hide auto-save */
  }
  
  @media screen and (max-width: 480px) {
     /* Maybe just show icons for buttons */
  }

</style>