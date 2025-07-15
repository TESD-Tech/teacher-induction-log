<svelte:options customElement="ps-signatures" />

<script lang="ts">
  import { formStore, formConfigStore } from '../../stores/formStore';
  import LogSection from '../ui/LogSection.svelte';
  // REMOVED: Unused import 'Signatures' type
  // import type { Signatures } from '../../stores/formStore'; 
  
  import { canEdit } from '../../permissions';
  export const userType: string | undefined = undefined;
</script>

{#if $formStore.signatures}
<section class="signatures-container">
  <div class="signatures-wrapper">
    <p class="signature-intro">
      These signatures certify that the above named inductee has completed the requirements of the Tredyffrin/Easttown New Staff Induction Program.
    </p>
    
    <div class="signatures-grid">
      <div class="signature-field">
        {#if canEdit($formConfigStore.userRole, 'signatures', 'signatures')}
          <input type="text" bind:value={$formStore.signatures.mentorTeacher} id="mentor-teacher-signature" />
          <div class="signature-line"></div>
          <label for="mentor-teacher-signature">Mentor Teacher</label>
        {:else}
          <div class="readonly-field" aria-label="Mentor Teacher Signature">{$formStore.signatures.mentorTeacher || ' '}</div> <div class="signature-line"></div>
          <div class="signature-label">Mentor Teacher</div>
        {/if}
      </div>
      
      <div class="signature-field">
        {#if canEdit($formConfigStore.userRole, 'signatures', 'signatures')}
          <input type="text" bind:value={$formStore.signatures.buildingPrincipal} id="building-principal-signature" />
          <div class="signature-line"></div>
          <label for="building-principal-signature">Building Principal</label>
        {:else}
          <div class="readonly-field" aria-label="Building Principal Signature">{$formStore.signatures.buildingPrincipal || ' '}</div>
          <div class="signature-line"></div>
          <div class="signature-label">Building Principal</div>
        {/if}
      </div>
      
      <div class="signature-field">
        {#if canEdit($formConfigStore.userRole, 'signatures', 'signatures')}
          <input type="text" bind:value={$formStore.signatures.superintendent} id="superintendent-signature" />
          <div class="signature-line"></div>
          <label for="superintendent-signature">Superintendent</label>
        {:else}
          <div class="readonly-field" aria-label="Superintendent Signature">{$formStore.signatures.superintendent || ' '}</div>
          <div class="signature-line"></div>
          <div class="signature-label">Superintendent</div>
        {/if}
      </div>
      
      <div class="signature-field signature-date">
        {#if canEdit($formConfigStore.userRole, 'signatures', 'signatures')}
          <input type="date" bind:value={$formStore.signatures.date} id="signature-date" />
          <div class="signature-line"></div>
          <label for="signature-date">Date</label>
        {:else}
           <div class="readonly-field" aria-label="Signature Date">{$formStore.signatures.date ? $formStore.signatures.date.replace(/-/g, '/') : ' '}</div> 
          <div class="signature-line"></div>
          <div class="signature-label">Date</div>
        {/if}
      </div>
    </div>
    
    <div class="signature-notes">
      <p>
        This completed log must be returned to the Staff Development Office at the Tredyffrin/Easttown School District Administration Offices.
      </p>
      <p>
        On the date of each activity, this log must be initialed by the mentor teacher, principal or seminar coordinator.
      </p>
    </div>
  </div>
</section>
{:else}
  <div>Loading signatures...</div>
{/if}

<style>
  .signatures-container {
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    /* REMOVED: width: 100%; */
    /* ADDED: Allow shrinking and prevent overflow */
    max-width: 100%; 
    box-sizing: border-box; 
    /* Center align if needed within its flex parent (.log-content) */
    margin-left: auto; 
    margin-right: auto;
     /* Optional: Set a specific max-width if needed, less than parent's 1400px */
    /* max-width: 900px;  */
  }
  
  .signatures-wrapper {
    /* Removed width/max-width, let it be determined by content */
    /* width: 100%; */
    /* max-width: 100%; */
  }
  
  .signature-intro {
    margin-bottom: 1.5rem;
    text-align: center;
    font-weight: 500;
  }
  
  .signatures-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem; /* Maybe reduce gap? */
    margin-bottom: 2rem;
  }
  
  .signature-field {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem; /* Maybe reduce margin? */
  }
  
  .signature-line {
    height: 1px;
    background-color: #000;
    margin: 0.75rem 0 0.25rem 0;
    width: 100%; /* Line takes full width of field */
  }
  
  .signature-field label,
  .signature-label {
    font-weight: 500;
    text-align: center;
  }
  
  .signature-field input[type="text"], 
  .signature-field input[type="date"] { /* Added date input */
    border: none;
    background: transparent;
    text-align: center;
    font-size: 1rem;
    padding: 0.5rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  .signature-field input:focus {
    outline: none;
    background-color: rgba(0, 123, 255, 0.05);
  }
  
  .readonly-field {
    text-align: center;
    min-height: 2.5rem; /* Ensure consistent height */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem; /* Match input padding */
    box-sizing: border-box;
    width: 100%; /* Take full width of field */
    /* background-color: #f8f9fa; */ /* Optional background */
  }
  
  .signature-notes {
    margin-top: 2rem;
    text-align: center;
    font-style: italic;
    font-size: 0.9rem;
    color: #666;
  }
  
  .signature-notes p {
    margin-bottom: 0.75rem;
  }
  
  /* Print-specific styles */
  @media print {
    .signatures-container {
      box-shadow: none;
      /* border: 1px solid #000; */ /* Remove border? */
      padding: 1rem;
      page-break-inside: avoid;
    }
    
    .signature-line {
      background-color: #000;
    }
    
    .signature-notes {
      color: #000;
    }
  }
  
  /* Responsive adjustments */
  @media screen and (max-width: 768px) {
    .signatures-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .signatures-container {
      padding: 1rem;
    }
    
    .signature-intro {
      font-size: 0.95rem;
    }
    
    .signature-notes {
      font-size: 0.85rem;
    }
  }
</style>