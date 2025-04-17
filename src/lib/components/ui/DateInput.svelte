<svelte:options customElement="ps-date-input" />

<script lang="ts">
  // Value prop now consistently expects/provides YYYY-MM-DD format
  export let value: string = ''; 
  export let readonly: boolean = false;
  export let name: string = '';
  export let required: boolean = false;
  
  let isValid = true;
  let errorMessage = '';
  let touched = false;

  // --- Removed formatDateForInput - No longer needed with direct binding ---
  
  // Convert YYYY-MM-DD format to MM/DD/YYYY for display ONLY in readonly mode
  function formatDateForDisplay(dateString: string): string {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return ''; // Only format valid YYYY-MM-DD
    
    try {
      // Split and rearrange without relying on Date object parsing for simple format change
      const [year, month, day] = dateString.split('-');
      // Basic validation of parts
      if (parseInt(year) < 1000 || parseInt(month) < 1 || parseInt(month) > 12 || parseInt(day) < 1 || parseInt(day) > 31) {
        return ''; // Return empty if parts seem invalid
      }
      return `${month}/${day}/${year}`;
    } catch (e) {
      return ''; // Return empty on error
    }
  }
  
  // Validate the date (expects YYYY-MM-DD)
  function validateDate(dateString: string): boolean {
    if (!dateString && !required) return true;
    if (!dateString && required) {
      errorMessage = 'Date is required';
      return false;
    }
    
    // Check YYYY-MM-DD format specifically
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      errorMessage = 'Invalid date format stored'; // Should not happen with native input
      return false;
    }

    // Check if the date components form a valid date
    const [year, month, day] = dateString.split('-').map(p => parseInt(p, 10));
    const date = new Date(year, month - 1, day); // Month is 0-indexed
    if (!(date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day)) {
        errorMessage = 'Invalid date entered';
        return false;
    }
    
    // Optional: Check that date is not in the future
    // const currentDate = new Date();
    // // Set hours to 0 to compare dates only
    // currentDate.setHours(0, 0, 0, 0); 
    // if (date > currentDate) {
    //   errorMessage = 'Date cannot be in the future';
    //   return false;
    // }
    
    errorMessage = ''; // Clear error message if valid
    return true;
  }
  
  // --- Removed handleDateChange - Using bind:value instead ---

  // Handle blur event for validation visual feedback
  function handleBlur() {
    touched = true;
    isValid = validateDate(value); // Validate the current bound value
  }

  // Recalculate validity when value changes externally or required status changes
  $: {
    // Avoid validating initial empty non-required value until touched
    if (touched || (required && value === '')) {
        isValid = validateDate(value);
    } else if (!required && value === '') {
        isValid = true; // Reset validity if not required and cleared before touch
        errorMessage = '';
    }
  }

</script>

{#if readonly}
  <div class="readonly-field">{formatDateForDisplay(value)}</div>
{:else}
  <div class="date-input-container">
    <input 
      type="date" 
      {name}
      bind:value={value}  
      on:blur={handleBlur}
      class:invalid={!isValid && touched}
      aria-invalid={!isValid && touched}
      aria-required={required}
      class="date-input"
      required={required} />
    {#if !isValid && touched}
      <div class="error-message" role="alert">{errorMessage}</div>
    {/if}
  </div>
{/if}

<style>
  /* Styles remain largely the same, adjusted class usage */
  /* ... */
  .date-input-container {
    position: relative;
    width: 100%;
    margin-bottom: 4px;
  }
  
  .date-input {
    border: 1px solid var(--input-border, #ccc);
    border-radius: 4px;
    padding: 0.5rem;
    width: 100%;
    font-family: inherit;
    background: white;
    box-sizing: border-box;
    display: block;
    margin: 0;
    height: 36px;
    font-size: 0.95rem;
    color: var(--text-color, #333);
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding-right: 2rem; /* Space for the calendar icon */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;
  }
  
  /* Consistent date-picker styling across browsers */
  input[type="date"]::-webkit-inner-spin-button,
  input[type="date"]::-webkit-calendar-picker-indicator {
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 2rem;
    height: 100%;
    cursor: pointer;
  }
  
  .date-input:focus {
    outline: none;
    border-color: var(--focus-color, #007bff);
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }
  
  .date-input.invalid {
    border-color: #dc3545;
    background-color: rgba(220, 53, 69, 0.05);
  }
  
  .readonly-field {
    background-color: #f8f9fa;
    display: flex;
    align-items: center;
    height: 36px;
    padding: 0 0.5rem;
    border-radius: 4px;
    border: 1px solid #eee;
    width: 100%;
  }
  
  .error-message {
    color: #dc3545;
    font-size: 0.8rem;
    margin-top: 4px;
    display: block;
    /* Removed absolute positioning for simplicity, adjust if needed */
    /* position: absolute; */
    /* bottom: -20px; */
    /* left: 0; */
    /* z-index: 1; */
    /* background-color: white; */
    /* padding: 0 4px; */
    /* border-radius: 2px; */
    /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); */
  }
  
  /* Responsive styles */
  @media screen and (max-width: 480px) {
    .date-input {
      font-size: 0.9rem;
      padding: 0.375rem 0.5rem;
    }
  }
  
  /* Firefox specific styles */
  @-moz-document url-prefix() {
    .date-input {
      padding-top: 0.375rem;
      padding-bottom: 0.375rem;
    }
  }
  
  /* Print styles */
  @media print {
    .error-message {
      display: none;
    }
    
    .date-input, .readonly-field {
      border: none;
      height: auto;
      min-height: 24px;
      padding: 4px;
      background: transparent;
    }
  }
</style>