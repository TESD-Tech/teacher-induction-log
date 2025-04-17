<svelte:options customElement="ps-form-row" />

<script lang="ts">
  // Props
  export let label: string;
  export let id: string = crypto.randomUUID();
  export let required: boolean = false;
  export let helpText: string = "";
  export let errorMessage: string = "";
  export let hasError: boolean = false;
</script>

<div class="form-row" class:has-error={hasError}>
  <label for={id} class="form-label">
    {label}
    {#if required}<span class="required-indicator">*</span>{/if}
  </label>
  
  <div class="input-container">
    <slot {id}></slot>
    
    {#if helpText}
      <div class="help-text">{helpText}</div>
    {/if}
    
    {#if hasError && errorMessage}
      <div class="error-message">{errorMessage}</div>
    {/if}
  </div>
</div>

<style>
  .form-row {
    display: flex;
    margin-bottom: 0.5rem;
    position: relative;
    width: 100%;
  }
  
  /* Enhanced label styling */
  .form-label {
    display: block;
    width: 38%;
    min-width: 120px;
    max-width: 180px;
    padding: 0.6rem 0.75rem 0.6rem 0;
    color: #333;
    font-weight: 500;
    text-align: right;
    flex-shrink: 0;
    line-height: 1.4;
    transition: color 0.2s;
  }
  
  /* Required field indicator */
  .required-indicator {
    color: #dc3545;
    margin-left: 0.25rem;
  }
  
  /* Enhanced input container */
  .input-container {
    flex-grow: 1;
    min-width: 0; /* Ensure container doesn't grow wider than parent */
    position: relative;
    display: flex;
    flex-direction: column;
  }
  
  /* Help text styling */
  .help-text {
    font-size: 0.85rem;
    color: #6c757d;
    margin-top: 0.25rem;
    line-height: 1.3;
  }
  
  /* Error state styling */
  .has-error .form-label {
    color: #dc3545;
  }
  
  .error-message {
    font-size: 0.85rem;
    color: #dc3545;
    margin-top: 0.25rem;
    font-weight: 500;
  }
  
  /* Highlight current focused row */
  .form-row:focus-within .form-label {
    color: #007bff;
    font-weight: 600;
  }
  
  /* Responsive adjustments */
  @media screen and (max-width: 768px) {
    .form-row {
      flex-direction: column;
      margin-bottom: 1rem;
    }
    
    .form-label {
      width: 100%;
      max-width: 100%;
      text-align: left;
      padding: 0 0 0.35rem 0;
    }
  }
  
  /* Print styles */
  @media print {
    .form-row {
      margin-bottom: 0.25rem;
      page-break-inside: avoid;
    }
    
    .help-text {
      display: none;
    }
  }
</style>
