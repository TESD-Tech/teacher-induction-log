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
  
  // Initialize auto-save on component mount
  onMount(() => {
    // Initialize auto-save functionality
    unsubscribeAutoSave = initializeAutoSave();
    
    // Add event listener for storage changes to update UI
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  });
  
  // Clean up subscriptions when component is destroyed
  onDestroy(() => {
    if (unsubscribeAutoSave) {
      unsubscribeAutoSave();
    }
  });
  
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
      notificationMessage.set('Form auto-saved');
      notificationType.set('info');
      showSaveNotification.set(true);
      
      // Hide notification after 2 seconds
      setTimeout(() => {
        showSaveNotification.set(false);
      }, 2000);
    }
  }
</script>

<div class="actions">
  <div class="auto-save-info">
    {#if lastSaveTime}
      <span class="last-saved">Last saved: {lastSaveTime}</span>
    {/if}
  </div>
  <div class="action-buttons">
    <Button on:click={printForm} class="action-button">
      <span class="icon"><Printer size={16} /></span> Print Form
    </Button>
    <Button on:click={handleSave} class="action-button primary">
      <span class="icon"><Save size={16} /></span> Save Form
    </Button>
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
  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
  }
  
  .auto-save-info {
    font-size: 0.85rem;
    color: #666;
    font-style: italic;
  }
  
  .last-saved {
    display: inline-block;
    padding: 4px 8px;
    background: #f8f9fa;
    border-radius: 4px;
  }
  
  .icon {
    display: inline-flex;
    align-items: center;
    margin-right: 0.5rem;
    vertical-align: middle;
  }
  
  .icon :global(svg) {
    fill: currentColor;
  }

  @media print {
    .actions {
      display: none;
    }
  }
  
  /* Responsive styles */
  @media screen and (max-width: 768px) {
    .actions {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }
    
    .action-buttons {
      justify-content: flex-end;
    }
    
    .auto-save-info {
      text-align: center;
      margin-bottom: 0.5rem;
    }
  }
  
  @media screen and (max-width: 480px) {
    .action-buttons {
      justify-content: space-between;
      width: 100%;
    }
    
    .last-saved {
      font-size: 0.8rem;
    }
  }
</style>
