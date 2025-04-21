<svelte:options customElement="ps-date-input" />

<script lang="ts">
  // Svelte 5 Runes are compiler features, they are NOT imported.
  // You use them directly within the script block.

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

  // Internal state managed with $state
  let isValid = $state(true); // Correct usage: $state is a syntax element
  let errorMessage = $state(''); // Correct usage: $state is a syntax element
  let touched = $state(false); // Correct usage: $state is a syntax element

  // Convert YYYY-MM-DD format to MM/DD/YYYY for display ONLY in readonly mode
  // This can remain a function as it's called directly in the template
  function formatDateForDisplay(dateString: string): string {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return ''; // Only format valid YYYY-MM-DD

    try {
      const [year, month, day] = dateString.split('-');
       // Basic validation of parts within formatting logic
      if (parseInt(year) < 1000) {
        errorMessage = 'Year must be 1000 or later'; // Sets state but not rendered in readonly
        return '';
      }
      if (parseInt(month) < 1 || parseInt(month) > 12 || parseInt(day) < 1 || parseInt(day) > 31) {
         errorMessage = 'Invalid date entered'; // Sets state but not rendered in readonly
         return '';
      }
      return `${month}/${day}/${year}`;
    } catch (e) {
      console.error('Error formatting date:', e);
      errorMessage = 'Formatting error'; // Sets state but not rendered in readonly
      return ''; // Return empty on error
    }
  }

  // Pure function to validate the date (expects YYYY-MM-DD)
  // Returns an object with validity status and an optional message
  function validateDate(dateString: string, isRequired: boolean): { valid: boolean, message: string } {
    if (!dateString && !isRequired) return { valid: true, message: '' };
    if (!dateString && isRequired) {
      return { valid: false, message: 'Date is required' };
    }

    // Check YYYY-MM-DD format specifically
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      // Note: Native date input prevents this usually, but good for robustness
      return { valid: false, message: 'Invalid date format stored' };
    }

    // Check if the date components form a valid date
    const [year, month, day] = dateString.split('-').map(p => parseInt(p, 10));
    const date = new Date(year, month - 1, day); // Month is 0-indexed

    // Check for valid date components and if the Date object correctly parsed them
    // (e.g., new Date(2023, 1, 30) returns March 2nd, which is not 2023-02-30)
    if (!(date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day)) {
        return { valid: false, message: 'Invalid date entered' };
    }

    // Optional: Check that date is not in the future (if uncommented)
    // const currentDate = new Date();
    // currentDate.setHours(0, 0, 0, 0);
    // if (date > currentDate) {
    //   return { valid: false, message: 'Date cannot be in the future' };
    // }

    return { valid: true, message: '' }; // Valid date
  }

  // Use an effect to react to changes in 'value', 'required', and 'touched'
  // and perform validation, updating '$state' variables 'isValid' and 'errorMessage'.
  $effect(() => { // Correct usage: $effect is a syntax element
    // This effect runs when any state or prop it reads changes: value, required, touched.
    // We apply validation logic based on the state.

    // If not touched and not required, and value is empty, it's valid with no message.
    // We avoid initial validation errors until the field is touched or required.
    if (!touched && !required && value === '') {
        isValid = true;
        errorMessage = '';
        return; // Stop here, no further validation needed in this state
    }

    // If touched, or if required and value is empty, run full validation.
    if (touched || (required && value === '')) {
        const validationResult = validateDate(value, required);
        isValid = validationResult.valid;
        errorMessage = validationResult.message;
    } else if (!required && value === '') {
        // Explicitly reset validity if not required and cleared before touch (after potentially being invalid)
        isValid = true;
        errorMessage = '';
    }
  });


  // Handle blur event - primarily sets the 'touched' state
  function handleBlur() {
    touched = true;
    // The $effect will react to 'touched' becoming true and trigger validation
    // if the conditions inside the effect are met (e.g., value is invalid or required empty).
  }

</script>

{#if readonly}
  <!-- Added data-testid for easier selection in tests -->
  <div class="readonly-field" data-testid="readonly-field">{formatDateForDisplay(value)}</div>
{:else}
  <div class="date-input-container">
    <input
      type="date"
      {name}
      bind:value={value}
      on:blur={handleBlur}
      class:invalid={!isValid && touched}
      aria-invalid={(!isValid && touched).toString()} 
      aria-required={required}
      data-testid="date-input"
      class="date-input"
      required={required} />
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