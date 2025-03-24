<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let variant: 'default' | 'add' | 'remove' = 'default';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let confirmMessage: string = 'Are you sure you want to delete this item?';
  
  const dispatch = createEventDispatcher();
  
  function handleClick(event) {
    // Only show confirmation for remove buttons
    if (variant === 'remove') {
      if (confirm(confirmMessage)) {
        // If confirmed, forward the click event
        dispatch('click', event);
      }
    } else {
      // For non-remove buttons, just forward the click event
      dispatch('click', event);
    }
  }
</script>

<button {type} class={variant} on:click={handleClick}>
  <slot></slot>
</button>

<style>
  button {
    padding: 8px 16px;
    margin: 5px;
    cursor: pointer;
    font-weight: 500;
    background-color: #f2f2f2;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
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
    background-color: #e6e6f7;
    border-color: #c3c3e6;
    color: #2a2a7d;
  }
  
  button.default:hover {
    background-color: #d1d1ec;
  }

  @media print {
    button {
      display: none;
    }
  }
</style>
