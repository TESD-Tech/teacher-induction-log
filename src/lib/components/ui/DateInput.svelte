<script lang="ts">
  export let value: string = '';
  export let readonly: boolean = false;
  
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
  
  // Handle date change
  function handleDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const newDate = input.value;
    
    // Update the value with formatted date
    if (newDate) {
      value = formatDateForDisplay(newDate);
    } else {
      value = '';
    }
  }
  
  $: inputValue = formatDateForInput(value);
</script>

{#if readonly}
  <div class="readonly-field">{value}</div>
{:else}
  <input 
    type="date" 
    value={inputValue} 
    on:change={handleDateChange}
    class="date-input"
  />
{/if}

<style>
  .date-input {
    border: 1px solid var(--input-border);
    border-radius: 4px;
    padding: 8px;
    width: 100%;
    font-family: inherit;
    background: white;
    box-sizing: border-box;
    display: block;
    margin: 0;
    height: 36px;
    font-size: 0.95rem;
    color: var(--text-color);
  }
  
  .date-input:focus {
    outline: none;
    border-color: var(--focus-color);
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
  
  .readonly-field {
    background-color: #f8f9fa;
    display: flex;
    align-items: center;
    height: 36px;
    padding: 0 10px;
    border-radius: 4px;
    border: 1px solid #eee;
  }
</style>
