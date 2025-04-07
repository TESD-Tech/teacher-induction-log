<script lang="ts">
  export let label: string;
  export let id: string = crypto.randomUUID();
</script>

<div class="form-row">
  <label for={id}>{label}</label>
  <div class="input-container">
    <slot {id}></slot>
  </div>
</div>

<style>
  .form-row {
    display: flex;
    align-items: center;
    gap: 1.25rem; /* Increased for better spacing */
    width: 100%;
    position: relative;
  }

  /* Add a subtle connector between label and input */
  .form-row::after {
    content: '';
    position: absolute;
    left: 140px; /* Adjust based on min-width of label */
    top: 50%;
    width: 8px;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
    transform: translateY(-50%);
  }

  label {
    width: auto;
    min-width: 150px; /* Slightly wider for better readability */
    max-width: 220px;
    flex-shrink: 0;
    font-weight: bold;
    text-align: right;
    color: #333; /* Slightly darker for better readability */
    transition: color 0.2s ease;
  }

  /* Style enhancement for label focus state */
  .form-row:focus-within label {
    color: #000;
  }

  .input-container {
    flex-grow: 1;
    min-width: 0;
    position: relative;
  }
  
  /* Responsive adjustments */
  @media screen and (min-width: 1200px) {
    label {
      min-width: 180px;
    }
    
    .form-row::after {
      left: 180px;
    }
  }
  
  /* Smaller screens */
  @media screen and (max-width: 600px) {
    .form-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .form-row::after {
      display: none; /* Hide connector on mobile */
    }
    
    label {
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      text-align: left;
      margin-bottom: 4px;
    }
    
    .input-container {
      width: 100%;
    }
  }
</style>
