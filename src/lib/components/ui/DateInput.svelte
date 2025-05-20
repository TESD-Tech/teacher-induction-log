<svelte:options customElement="ps-date-input" />

<script lang="ts">
  // Svelte 5 Runes are compiler features, they are NOT imported.
  // You use them directly within the script block.

  // Svelte 5 runes for state and bindable props
  let isValid = $state(true);
  let errorMessage = $state('');
  let touched = $state(false);

  // All props, including bindable ones, are declared within $props()
  // Destructure the result of $props() to declare your props.
  let {
    readonly = false, // Regular prop with default value
    name = '',        // Regular prop with default value
    required = false, // Regular prop with default value
    value = $bindable('') // Bindable prop with default value and $bindable()
  } = $props<{ // Type annotation for the $props() declaration
    readonly?: boolean; // Use ? if the prop is optional from the parent's perspective
    name?: string;
    required?: boolean;
    value?: string; // The type of the bindable prop itself
  }>();

  // Convert YYYY-MM-DD format to MM/DD/YYYY for display ONLY in readonly mode
  // This can remain a function as it's called directly in the template
  function formatDateForDisplay(dateString: string): string {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return ''; // Only format valid YYYY-MM-DD

    try {
      const [year, month, day] = dateString.split('-');
       // Basic validation of parts within formatting logic
      // Note: This validation here is primarily for formatting,
      // the main validation for input is in validateDate and the effect.
      if (parseInt(year, 10) < 1000) {
        // Although this sets errorMessage, it won't be shown in readonly mode's div
        // consider if you need separate state/handling for readonly display errors.
        // For now, we just return empty string.
        return '';
      }
       if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12 || parseInt(day, 10) < 1 || parseInt(day, 10) > 31) {
         // Similarly, won't show error message in readonly, just return empty.
         return '';
      }
      return `${month}/${day}/${year}`;
    } catch (e) {
      console.error('Error formatting date:', e);
      // Won't show error message in readonly, just return empty.
      return ''; // Return empty on error
    }
  }

  // Pure function to validate the date (expects YYYY-MM-DD)
  // Returns an object with validity status and an optional message
  function validateDate(dateString: string, isRequired: boolean): { valid: boolean, message: string } {
    // If a value exists, validate its format and date components first
    if (dateString) {
      // Check YYYY-MM-DD format specifically
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        // This handles cases like "invalid-date"
        return { valid: false, message: 'Invalid date format stored' };
      }

      const [year, month, day] = dateString.split('-').map(p => parseInt(p, 10));

      // Check for valid number parsing and ranges before creating Date object
      if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
           return { valid: false, message: 'Invalid date entered' };
      }

      const date = new Date(year, month - 1, day); // Month is 0-indexed

      // Check that the Date object's components match the input components
      if (!(date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day)) {
          return { valid: false, message: 'Invalid date entered' };
      }
    }

    // Handle the case where the field is required but empty
    if (!dateString && isRequired) {
      return { valid: false, message: 'Date is required' };
    }

    // If the field is empty and not required, it's valid
    if (!dateString && !isRequired) {
        return { valid: true, message: '' };
    }


    // Optional: Check that date is not in the future (if uncommented)
    // const currentDate = new Date();
    // currentDate.setHours(0, 0, 0, 0);
    // if (date > currentDate) {
    //   return { valid: false, message: 'Date cannot be in the future' } ;
    // }

    return { valid: true, message: '' }; // Valid date
  }

  function validateAndSetState() {
    const validationResult = validateDate(value, required);
    isValid = validationResult.valid;
    errorMessage = validationResult.message;
  }

  function handleBlur() {
    touched = true;
    validateAndSetState();
  }

  function handleInput() {
    validateAndSetState();
  }

  // Initial validation (in case value is pre-filled)
  validateAndSetState();

</script>

{#if readonly}
  <div class="readonly-field" data-testid="readonly-field">{formatDateForDisplay(value)}</div>
{:else}
  <div class="date-input-container">
    <input
      type="date"
      {name}
      bind:value={value}
      onblur={handleBlur}
      oninput={handleInput}
      class:invalid={!isValid && touched}
      aria-invalid={!isValid && touched}
      aria-required={required}
      data-testid="date-input"
      class="date-input"
      required={required}
    />
    {#if !isValid && touched}
      <div class="error-message" role="alert">{errorMessage}</div>
    {/if}
  </div>
{/if}

<style>
  /* ... (CSS remains the same) ... */
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
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3Cline%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3Cline%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3Cline%3E%3C/svg%3E");
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