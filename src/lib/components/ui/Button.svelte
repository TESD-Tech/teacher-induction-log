<svelte:options customElement="ps-button" />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let variant: 'default' | 'add' | 'remove' = 'default';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let confirmMessage: string = 'Are you sure you want to delete this item?';
  export let compact: boolean = false;
  export let onclick: ((event: MouseEvent) => void) | undefined = undefined;
  
  const dispatch = createEventDispatcher();
  
  function handleClick(event: MouseEvent) {
    // Only show confirmation for remove buttons
    if (variant === 'remove') {
      if (confirm(confirmMessage)) {
        // If confirmed, forward the click event
        dispatch('click', event);
        if (onclick) onclick(event);
      }
    } else {
      // For non-remove buttons, just forward the click event
      dispatch('click', event);
      if (onclick) onclick(event);
    }
  }
</script>

<button {type} class={`${variant} ${compact ? 'compact' : ''}`} on:click={handleClick}>
  <slot></slot>
</button>

<style>
  button {
    padding: 0.5rem 1rem;
    margin: 0.25rem;
    cursor: pointer;
    font-weight: 500;
    background-color: #f2f2f2;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    font-size: 0.95rem;
    line-height: 1.5;
    height: 36px;
  }

  button:hover {
    background-color: #e0e0e0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  button.add {
    background-color: #e6f7e6;
    border-color: #c3e6c3;
    color: #2a7d2a;
  }
  
  button.add:hover {
    background-color: #d1ecd1;
  }

  button.remove {
    background-color: #f7e6e6;
    border-color: #e6c3c3;
    color: #7d2a2a;
  }
  
  button.remove:hover {
    background-color: #ecd1d1;
  }

  button.default {
    background-color: #f8f8f8;
    border-color: #ddd;
    color: #444;
    font-weight: normal;
  }
  
  button.default:hover {
    background-color: #f0f0f0;
    border-color: #ccc;
  }

  button.compact {
    padding: 0.25rem 0.75rem;
    font-size: 0.85rem;
    height: 30px;
    margin: 0 0.1rem;
  }

  @media print {
    button {
      display: none;
    }
  }

  @media screen and (max-width: 480px) {
    button {
      padding: 0.375rem 0.75rem;
      font-size: 0.9rem;
      height: 34px;
    }
    
    button.compact {
      padding: 0.25rem 0.5rem;
      height: 28px;
      font-size: 0.8rem;
    }
  }
</style>
