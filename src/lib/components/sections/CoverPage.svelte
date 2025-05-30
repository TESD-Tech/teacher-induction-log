<svelte:options customElement="ps-cover-page" />

<script lang="ts">
  // Import stores, helpers, and UI components
  import { formStore as defaultFormStore, formConfigStore as defaultFormConfigStore } from '../../stores/formStore'; 
  import { canEdit } from '../../permissions';
  import FormRow from '../ui/FormRow.svelte';
  import Select from '../ui/Select.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { FormData, FormConfig } from '../../stores/formStore';

  // Props for stores (for when passed as props in tests)
  export let formStore: Writable<FormData> | undefined = undefined;
  export let formConfigStore: Writable<FormConfig> | undefined = undefined;
  export let userType: string | undefined = undefined;

  // Try to get stores from context first, then props, then fall back to defaults
  const contextFormStore = getContext<Writable<FormData>>('formStore');
  const contextFormConfigStore = getContext<Writable<FormConfig>>('formConfigStore');
  
  // Use context stores if available, otherwise props, otherwise defaults
  $: actualFormStore = contextFormStore || formStore || defaultFormStore;
  $: actualFormConfigStore = contextFormConfigStore || formConfigStore || defaultFormConfigStore;
</script>

<div class="cover-page-section">

  <fieldset class="inductee-info">
    <legend>Inductee Information</legend>

    <div class="info-grid">
      <div class="info-column">
        <FormRow label="Inductee" let:id>
          {#if canEdit($actualFormConfigStore.userRole, 'coverPage', 'inductee')}
            <input 
              type="text" 
              id={id} 
              bind:value={$actualFormStore.inductee} 
              placeholder="Last, First" 
              aria-label="Inductee Name"
              class="form-input"
            />
          {:else}
            <div class="readonly-field" id={id}>{$actualFormStore.inductee || ' '}</div>
          {/if}
        </FormRow>

        <FormRow label="Building" let:id>
          {#if canEdit($actualFormConfigStore.userRole, 'coverPage', 'building')}
            <Select
              {id}
              bind:value={$actualFormStore.building}
              options={$actualFormConfigStore.options.buildings}
              placeholder="-- Select Building --"
              ariaLabel="School Building"
              required={true}
              className="form-input" 
            />
          {:else}
            <div class="readonly-field" id={id}>{$actualFormStore.building || ' '}</div>
          {/if}
        </FormRow>

        <FormRow label="Assignment" let:id>
          {#if canEdit($actualFormConfigStore.userRole, 'coverPage', 'assignment')}
             <Select
              {id}
              bind:value={$actualFormStore.assignment}
              options={$actualFormConfigStore.options.assignments}
              placeholder="-- Select Assignment --"
              ariaLabel="Teaching Assignment"
              required={true}
              className="form-input"
            />
          {:else}
            <div class="readonly-field" id={id}>{$actualFormStore.assignment || ' '}</div>
          {/if}
        </FormRow>
      </div>

      <div class="info-column">
        <FormRow label="Mentor Teacher" let:id>
          {#if canEdit($actualFormConfigStore.userRole, 'coverPage', 'mentorTeacher')}
             <Select
              {id}
              bind:value={$actualFormStore.mentorTeacher}
              options={$actualFormConfigStore.options.mentors}
              placeholder="-- Select Mentor --"
              ariaLabel="Mentor Teacher Name"
              required={true}
              className="form-input"
            />
          {:else}
            <div class="readonly-field" id={id}>{$actualFormStore.mentorTeacher || ' '}</div>
          {/if}
        </FormRow>

        <FormRow label="School Year (Year 1)" let:id>
          {#if canEdit($actualFormConfigStore.userRole, 'coverPage', 'schoolYearOne')}
             <Select
              {id}
              bind:value={$actualFormStore.schoolYearOne}
              options={$actualFormConfigStore.options.schoolYears}
              placeholder="-- Select Year --"
              ariaLabel="School Year One"
              required={true}
              className="form-input year-input" 
            />
          {:else}
            <div class="readonly-field" id={id}>{$actualFormStore.schoolYearOne || ' '}</div>
          {/if}
        </FormRow>

        <FormRow label="School Year (Year 2)" let:id>
          {#if canEdit($actualFormConfigStore.userRole, 'coverPage', 'schoolYearTwo')}
             <Select
              {id}
              bind:value={$actualFormStore.schoolYearTwo}
              options={$actualFormConfigStore.options.schoolYears}
              placeholder="-- Select Year --"
              ariaLabel="School Year Two"
              required={true}
              className="form-input year-input"
            />
          {:else}
            <div class="readonly-field" id={id}>{$actualFormStore.schoolYearTwo || ' '}</div>
          {/if}
        </FormRow>
      </div>
    </div>
  </fieldset>
</div>

<style>
  /* Cover page section styles */
  .cover-page-section {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto 2rem auto;
    padding: 0;
    font-family: var(--font-family, system-ui, sans-serif);
    box-sizing: border-box;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: white;
    overflow: hidden;
  }

  /* District Header styling */
  .district-header {
    text-align: center;
    background-color: #fbca28; /* District yellow */
    color: #333;
    padding: 1.5rem 1rem;
    border-bottom: 3px solid #444;
    margin-bottom: 1.5rem;
  }

  .district-header h1 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .district-header h2 {
    font-size: 1.25rem;
    margin: 0;
    font-weight: 500;
  }

  /* Form fieldset styling */
  .inductee-info {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 2rem 2.5rem;
    margin: 0 1.5rem 1.5rem 1.5rem;
    position: relative;
  }

  .inductee-info legend {
    font-weight: 600;
    padding: 0 1rem;
    color: #333;
    background-color: white;
    border-radius: 4px;
    font-size: 1.1rem;
  }

  /* Grid layout for information */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .info-column {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* Form inputs styling */
  .form-input {
    width: 100%;
    padding: 0.6rem 0.75rem;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    font-family: inherit;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-input:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    outline: none;
  }

  .form-input::placeholder {
    color: #aaa;
    font-style: italic;
    font-size: 0.9rem;
  }

  .year-input {
    font-family: monospace;
    letter-spacing: 0.5px;
  }

  /* Readonly fields */
  .readonly-field {
    width: 100%;
    min-height: 42px;
    padding: 0.6rem 0.75rem;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    background-color: #f8f8f8;
    display: flex;
    align-items: center;
  }
  
  /* Empty field styles */
  .readonly-field:empty::after {
    content: '\00a0'; /* Non-breaking space */
  }

  /* Action buttons */
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 0 1.5rem 1.5rem 1.5rem;
  }

  .btn {
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s, transform 0.1s;
  }

  .btn:active {
    transform: translateY(1px);
  }

  .print-btn {
    background-color: #6c757d;
    color: white;
  }

  .print-btn:hover {
    background-color: #5a6268;
  }

  .save-btn {
    background-color: #007bff;
    color: white;
  }

  .save-btn:hover {
    background-color: #0069d9;
  }

  .btn-icon {
    font-size: 1.1rem;
  }

  /* Print styles */
  @media print {
    .cover-page-section {
      box-shadow: none;
      margin: 0;
      padding: 0;
    }
    
    .district-header {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
    
    .form-actions {
      display: none;
    }
  }

  /* Responsive styling */
  @media screen and (max-width: 900px) {
    .info-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .inductee-info {
      padding: 1.5rem;
      margin: 0 1rem 1rem 1rem;
    }
    
    .form-actions {
      padding: 0 1rem 1rem 1rem;
      flex-direction: column;
    }
    
    .btn {
      width: 100%;
      justify-content: center;
    }
  }

  @media screen and (max-width: 576px) {
    .district-header h1 {
      font-size: 1.25rem;
    }
    
    .district-header h2 {
      font-size: 1.1rem;
    }
    
    .inductee-info {
      padding: 1rem;
      margin: 0 0.5rem 0.5rem 0.5rem;
    }
  }
</style>
