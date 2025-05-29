<svelte:options customElement="ps-button" />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  // Svelte 5 Runes are compiler features, they are NOT imported.

  // All props, including regular ones, are declared within $props()
  // Destructure the result of $props() to declare your props.
  let {
    variant = 'default', // Regular prop with default value
    type = 'button',     // Regular prop with default value
    confirmMessage = 'Are you sure you want to delete this item?', // Regular prop with default value
    compact = false,     // Regular prop with default value
    onclick = undefined, // Regular prop (function) with default value
    children            // Svelte 5 slot content
  } = $props<{ // Type annotation for the $props() declaration
    variant?: 'default' | 'add' | 'remove'; // Using ? for optionality allows omitting the prop
    type?: 'button' | 'submit' | 'reset';
    confirmMessage?: string;
    compact?: boolean;
    onclick?: ((event: MouseEvent) => void) | undefined; // Type for the function prop
    children?: any;
  }>();

  // createEventDispatcher is not part of the rune system, remains the same
  const dispatch = createEventDispatcher();

  function handleClick(event: MouseEvent) {
    // Access props directly as they are now part of the component's scope via $props()
    if (variant === 'remove') {
      // Mocking `confirm` will be necessary in tests
      if (confirm(confirmMessage)) {
        // If confirmed, forward the click event
        dispatch('click', event);
        if (onclick) onclick(event); // Call the optional onclick prop function
      }
    } else {
      // For non-remove buttons, just forward the click event
      dispatch('click', event);
      if (onclick) onclick(event); // Call the optional onclick prop function
    }
  }
</script>

<button
  {type}
  class={`${variant} ${compact ? 'compact' : ''}`}
  onclick={handleClick}
  data-testid="ps-button"
>
  {@render children?.()}
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