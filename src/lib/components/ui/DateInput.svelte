<script lang="ts">
  export let value: string = '';
  export let readonly: boolean = false;
  export let name: string = '';
  export let required: boolean = false;
  
  let isValid = true;
  let errorMessage = '';
  let touched = false;
  
  // Convert string date to YYYY-MM-DD format for the date input
  function formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    
    // Try to parse the date string
    const dateParts = dateString.split('/');
    if (dateParts.length === 3) {
      // If it's in MM/DD/YYYY format
      const [month, day, year] = dateParts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // If it's already in YYYY-MM-DD format or another format
    return dateString;
  }
  
  // Convert YYYY-MM-DD format to MM/DD/YYYY for display
  function formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid
      
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${month}/${day}/${year}`;
    } catch (e) {
      return dateString; // Return original if parsing fails
    }
  }
  
  // Validate the date
  function validateDate(dateString: string): boolean {
    if (!dateString && !required) return true;
    if (!dateString && required) {
      errorMessage = 'Date is required';
      return false;
    }
    
    // Check for various formats (MM/DD/YYYY, YYYY-MM-DD)
    let isValidFormat = false;
    let date: Date;
    
    // Check MM/DD/YYYY format
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      const [month, day, year] = dateString.split('/').map(p => parseInt(p, 10));
      date = new Date(year, month - 1, day);
      isValidFormat = date.getFullYear() === year && 
                      date.getMonth() === month - 1 && 
                      date.getDate() === day;
    } 
    // Check YYYY-MM-DD format
    else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(p => parseInt(p, 10));
      date = new Date(year, month - 1, day);
      isValidFormat = date.getFullYear() === year && 
                      date.getMonth() === month - 1 && 
                      date.getDate() === day;
    }
    
    if (!isValidFormat) {
      errorMessage = 'Please enter a valid date (MM/DD/YYYY)';
      return false;
    }
    
    // Check that date is not in the future
    const currentDate = new Date();
    if (date > currentDate) {
      errorMessage = 'Date cannot be in the future';
      return false;
    }
    
    return true;
  }
  
  // Handle date change
  function handleDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const newDate = input.value;
    touched = true;
    
    // Update the value with formatted date
    if (newDate) {
      value = formatDateForDisplay(newDate);
      isValid = validateDate(value);
    } else {
      value = '';
      isValid = !required;
      if (!isValid) {
        errorMessage = 'Date is required';
      }
    }
  }
  
  // Handle blur event for validation
  function handleBlur() {
    touched = true;
    isValid = validateDate(value);
  }
  
  $: inputValue = formatDateForInput(value);
</script>

{#if readonly}
  <div class="readonly-field">{formatDateForDisplay(value)}</div>
{:else}
  <div class="date-input-container">
    <input 
      type="date" 
      {name}
      value={inputValue} 
      on:change={handleDateChange}
      on:blur={handleBlur}
      class={`date-input ${!isValid && touched ? 'invalid' : ''}`}
      aria-invalid={!isValid && touched}
      aria-required={required}
    />
    {#if !isValid && touched}
      <div class="error-message" role="alert">{errorMessage}</div>
    {/if}
  </div>
{/if}

<style>
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
    position: absolute;
    bottom: -20px;
    left: 0;
    z-index: 1;
    background-color: white;
    padding: 0 4px;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
