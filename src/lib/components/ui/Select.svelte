<script lang="ts">
  /**
   * Reusable Select Dropdown Component (Handles Object Options)
   * - Binds the selected value (usually an ID).
   * - Populates options from an array of objects.
   * - Specifies keys for option value and display text.
   * - Shows a placeholder.
   * - Persists and displays the current value (ID) even if its object is no longer in the options list.
   * - KEEPS the original historical value in the list even after selecting another option.
   */
  import { onMount } from 'svelte'; // Import onMount

  // --- Props ---
  export let value: string | number | null | undefined = undefined;
  
  // Use a local variable for the select binding
  let boundValue = value ?? '';
  
  // Watch for external changes to value prop
  $: if (value !== undefined && value !== null && boundValue !== value) {
    boundValue = value;
  }
  
  // Handle changes from user interaction
  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    boundValue = target.value;
    value = target.value === '' ? undefined : target.value;
  }
  export let options: any[] = []; 
  export let placeholder: string = '-- Select --';
  export let id: string = '';
  export let name: string = '';
  export let required: boolean = false;
  export let ariaLabel: string = '';
  export let className: string = '';
  export let optionValueKey: string = 'dcid'; 
  export let optionDisplayKey: string = 'name'; 

  // --- State for historical value ---
  let initialValue: typeof value = undefined;
  let isInitialValueHistorical = false;
  let initialValueDisplayText = ''; // Store display text for the initial value

  onMount(() => {
    initialValue = value; // Capture the value when the component first mounts
    
    // Check if this initial value exists but is not in the current options list
    if (initialValue !== null && initialValue !== undefined && initialValue !== '') {
      const initialOptionExists = options.some(opt => opt[optionValueKey] === initialValue);
      if (!initialOptionExists) {
        isInitialValueHistorical = true;
        // We only have the ID, so we'll display that with a note
        initialValueDisplayText = `${initialValue}`; 
      }
    }
  });

  // --- Reactive Logic ---
  // Check if the CURRENTLY selected value is in the options list
  // We still need this to know if the current selection itself is valid/listed
  $: isValueInOptions = value !== null && value !== undefined && value !== '' && 
                        options.some(opt => opt[optionValueKey] === value);

</script>

<select
  {id}
  {name}
  value={boundValue}
  on:change={handleChange}
  {required}
  aria-label={ariaLabel || placeholder}
  class="form-select {className}"
>
  <option value="" disabled selected={value === null || value === undefined || value === ''}>{placeholder}</option>

  {#each options as option (option[optionValueKey])}
    <option value={option[optionValueKey]}>{option[optionDisplayKey]}</option>
  {/each}

  {#if isInitialValueHistorical && (initialValue !== value || !isValueInOptions)}
    <option value={initialValue}>{initialValueDisplayText}</option> 
  {/if}

  {#if (value !== null && value !== undefined && value !== '') && !isValueInOptions && value !== initialValue}
     <option value={value}>{value} (Current ID - Not in list)</option>
   {/if}

</select>

<style>
  /* Styles remain the same as before */
  .form-select {
    width: 100%;
    padding: 0.4rem 0.75rem; 
    border: 1px solid var(--input-border, #d0d0d0); 
    border-radius: var(--border-radius, 4px); 
    font-family: inherit;
    font-size: 1rem;
    background-color: white;
    height: var(--input-height, 36px); 
    box-sizing: border-box;
    cursor: pointer;
    appearance: none; 
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23333'%3E%3Cpath d='M8 11L3 6h10L8 11z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 10px 10px;
    padding-right: 2.5rem; 
    transition: border-color 0.2s, box-shadow 0.2s;
    line-height: normal; 
  }

  .form-select:focus {
    border-color: var(--focus-color, #007bff); 
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    outline: none;
  }

  .form-select:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }

  /* Style for the historical/original option if needed */
  .form-select option[value="{initialValue}"],
  .form-select option[value="{value}"] { 
     /* Add styles here if you want to visually distinguish non-listed options */
     /* font-style: italic; */
     /* color: #555; */
  }

  @media print {
    .form-select {
      appearance: none;
      -webkit-appearance: none;
      border: none;
      background: none;
      padding: 0;
      padding-right: 0; 
      height: auto; 
    }
  }
</style>
