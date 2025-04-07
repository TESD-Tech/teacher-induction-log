<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { printForm, saveForm } from '../../stores/formStore';
  import { manualSave, initializeAutoSave } from '../../stores/saveManager';
  import { writable } from 'svelte/store';
  import Button from './Button.svelte';
  import Notification from './Notification.svelte';
  import Printer from "carbon-icons-svelte/lib/Printer.svelte";
  import Save from "carbon-icons-svelte/lib/Save.svelte";
  
  // State for notification
  const showSaveNotification = writable(false);
  const notificationMessage = writable('');
  const notificationType = writable<'success' | 'info' | 'warning' | 'error'>('info');
  
  // State for auto-save
  let lastSaveTime = '';
  let unsubscribeAutoSave: () => void;

  // State for scroll effects
  let scrollY = 0;
  let scrollThreshold = 50; // Pixels to scroll before starting the effect
  
  // Initialize auto-save on component mount
  onMount(() => {
    // Initialize auto-save functionality
    unsubscribeAutoSave = initializeAutoSave();
    
    // Add event listener for storage changes to update UI
    window.addEventListener('storage', handleStorageChange);

    // Add scroll event listener for toolbar effects
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('scroll', handleScroll);
    };
  });
  
  // Clean up subscriptions when component is destroyed
  onDestroy(() => {
    if (unsubscribeAutoSave) {
      unsubscribeAutoSave();
    }
  });

  // Handle scroll events to update toolbar appearance
  function handleScroll() {
    scrollY = window.scrollY;
  }
  
  // Handle manual save button click
  function handleSave() {
    try {
      // First call the original saveForm function
      saveForm();
      
      // Then call our enhanced manualSave function
      manualSave();
      
      // Update last save time
      lastSaveTime = new Date().toLocaleTimeString();
      
      // Show success notification
      notificationMessage.set('Form saved successfully');
      notificationType.set('success');
      showSaveNotification.set(true);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        showSaveNotification.set(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving form:', error);
      
      // Show error notification
      notificationMessage.set('Failed to save form');
      notificationType.set('error');
      showSaveNotification.set(true);
    }
  }
  
  // Handle storage events (when auto-save occurs)
  function handleStorageChange(event: StorageEvent) {
    if (event.key === 'teacher-induction-log-data') {
      lastSaveTime = new Date().toLocaleTimeString();
      
      // Show auto-save notification
      notificationMessage.set('Form data auto-saved: ' + lastSaveTime);
      notificationType.set('info');
      showSaveNotification.set(true);
      
      // Hide notification after 2 seconds
      setTimeout(() => {
        showSaveNotification.set(false);
      }, 2000);
    }
  }

  // Calculate opacity and shadow based on scroll position
  $: opacity = Math.min(scrollY / scrollThreshold, 0.95);
  $: shadowOpacity = Math.min(scrollY / scrollThreshold, 0.15);
  $: toolbarStyle = `
    background-color: rgba(255, 255, 255, ${opacity});
    box-shadow: 0 ${shadowOpacity * 8}px ${shadowOpacity * 16}px rgba(0, 0, 0, ${shadowOpacity});
    border-bottom: ${scrollY > 10 ? '1px solid rgba(224, 224, 224, 0.5)' : 'none'};
  `;
  
  // Title is always visible in the toolbar
  $: isScrolled = true; 
  $: headerStyle = scrollY > 180 ? 'compact' : 'full';
</script>

<div class="header-toolbar {headerStyle}" style={toolbarStyle}>
  <div class="toolbar-container">
    <!-- Title that appears when scrolling -->
    <div class="toolbar-content">
      <div class="title-block" class:visible={isScrolled || scrollY < 5}>
        <div class="district-title">TREDYFFRIN/EASTTOWN SCHOOL DISTRICT</div>
        <div class="separator">|</div>
        <div class="app-title">Teacher Induction Log</div>
      </div>
      
      <div class="auto-save-info">
        {#if lastSaveTime}
          <span class="last-saved">Last saved: {lastSaveTime}</span>
        {/if}
      </div>
      
      <div class="action-buttons">
        <Button on:click={printForm} class="default compact">
          <span class="icon"><Printer size={14} /></span> Print Form
        </Button>
        <Button on:click={handleSave} class="default compact">
          <span class="icon"><Save size={14} /></span> Save Form
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
    position: fixed; /* Fixed at the top of the viewport */
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000; /* Keep on top of other elements */
    transition: all 0.3s ease; /* Smooth transition for opacity and shadow */
    backdrop-filter: blur(10px); /* Blur effect for browsers that support it */
    -webkit-backdrop-filter: blur(10px); /* For Safari */
  }
  
  .header-toolbar.full {
    padding: 6px 0;
    height: 58px;
  }
  
  .header-toolbar.compact {
    padding: 4px 0;
    height: 48px;
  }
  
  .toolbar-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
    height: 100%;
  }
  
  .toolbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    position: relative;
  }
  
  .title-block {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
  }
  
  .title-block.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .district-title {
    font-weight: bold;
    font-size: 1.1rem;
    color: #333;
  }

  .separator {
    margin: 0 10px;
    color: #666;
  }
  
  .app-title {
    font-weight: normal;
    font-size: 1.1rem;
    color: #333;
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem; /* Increased gap between buttons */
    margin-left: auto; /* Push to the right */
  }
  
  .auto-save-info {
    font-size: 0.85rem;
    color: #444;
    font-style: italic;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .last-saved {
    display: inline-block;
    padding: 3px 8px;
    background: rgba(255, 255, 255, 0.7); /* Semi-transparent background */
    border-radius: 4px;
    border: 1px solid rgba(224, 224, 224, 0.5);
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

  @media print {
    .header-toolbar {
      display: none;
    }
  }
  
  /* Responsive styles */
  @media screen and (max-width: 767px) {
    .toolbar-container {
      padding: 0 10px;
    }
    
    .auto-save-info {
      font-size: 0.7rem;
      max-width: 40%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .district-title {
      font-size: 0.95rem;
    }
    
    .app-title {
      font-size: 0.95rem;
    }
  }
  
  /* Very small screens - hide the auto-save info when space is limited */
  @media screen and (max-width: 480px) {
    .auto-save-info {
      display: none;
    }
    
    .title-block {
      left: 0;
      transform: none;
    }
    
    .district-title {
      font-size: 0.85rem;
    }
    
    .separator {
      margin: 0 5px;
    }
    
    .app-title {
      font-size: 0.8rem;
      display: none; /* Hide the subtitle on very small screens */
    }
  }
</style>
