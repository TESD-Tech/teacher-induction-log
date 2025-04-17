<svelte:options customElement="ps-notification" />

<script lang="ts">
  import { fly } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';
  
  export let message: string;
  export let type: 'success' | 'info' | 'warning' | 'error' = 'info';
  export let duration: number = 3000; // Duration in milliseconds
  export let position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';
  
  let visible = true;
  let timer: ReturnType<typeof setTimeout>;
  
  // Set up timer to hide notification after duration
  onMount(() => {
    if (duration > 0) {
      timer = setTimeout(() => {
        visible = false;
      }, duration);
    }
  });
  
  // Clean up timer on component destruction
  onDestroy(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });
  
  // Handle manually closing the notification
  function close() {
    visible = false;
    if (timer) {
      clearTimeout(timer);
    }
  }
  
  // Map position to CSS classes
  $: positionClass = {
    'top-right': 'notification-top-right',
    'top-left': 'notification-top-left',
    'bottom-right': 'notification-bottom-right',
    'bottom-left': 'notification-bottom-left'
  }[position];
</script>

{#if visible}
  <div
    class={`notification ${type} ${positionClass}`}
    role="alert"
    transition:fly={{ y: position.includes('top') ? -20 : 20, duration: 300 }}
  >
    <div class="notification-content">
      <span class="message">{message}</span>
    </div>
    <button class="close-button" on:click={close} aria-label="Close notification">
      &times;
    </button>
  </div>
{/if}

<style>
  .notification {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 200px;
    max-width: 350px;
    padding: 12px 15px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    font-size: 0.9rem;
    background-color: white;
    border-left: 4px solid #ccc;
  }
  
  .notification-content {
    flex: 1;
    padding-right: 10px;
  }

  .notification.success {
    border-left-color: #28a745;
    background-color: #f0fff4;
  }
  
  .notification.info {
    border-left-color: #17a2b8;
    background-color: #f0f8ff;
  }
  
  .notification.warning {
    border-left-color: #ffc107;
    background-color: #fffbf0;
  }
  
  .notification.error {
    border-left-color: #dc3545;
    background-color: #fff0f0;
  }
  
  .notification-top-right {
    top: 20px;
    right: 20px;
  }
  
  .notification-top-left {
    top: 20px;
    left: 20px;
  }
  
  .notification-bottom-right {
    bottom: 20px;
    right: 20px;
  }
  
  .notification-bottom-left {
    bottom: 20px;
    left: 20px;
  }
  
  .close-button {
    background: transparent;
    border: none;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0 5px;
    margin-left: 5px;
    color: #777;
  }
  
  .close-button:hover {
    color: #333;
  }
  
  .message {
    color: #333;
  }
  
  /* Responsive adjustments */
  @media screen and (max-width: 480px) {
    .notification {
      min-width: 150px;
      max-width: 280px;
      font-size: 0.85rem;
      padding: 10px 12px;
    }
    
    .notification-top-right,
    .notification-bottom-right {
      right: 10px;
    }
    
    .notification-top-left,
    .notification-bottom-left {
      left: 10px;
    }
    
    .notification-top-right,
    .notification-top-left {
      top: 10px;
    }
    
    .notification-bottom-right,
    .notification-bottom-left {
      bottom: 10px;
    }
  }
  
  /* Print styles - hide in print */
  @media print {
    .notification {
      display: none;
    }
  }
</style>
