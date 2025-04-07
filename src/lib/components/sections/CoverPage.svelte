<script lang="ts">
  import { formStore, formConfigStore } from '../../stores/formStore';
  import FormRow from '../ui/FormRow.svelte'; // Assuming FormRow handles label and input layout
</script>

<div class="cover-page-section">
  <header class="header">
    <h2>Teacher Induction Log</h2>
    <h3>Log Sheet</h3>
  </header>

  <fieldset class="inductee-info">
    <legend>Inductee Information</legend>

    <FormRow label="Inductee" let:id>
      {#if $formConfigStore.editable.inductee}
        <input type="text" id={id} bind:value={$formStore.inductee} />
      {:else}
        <div class="readonly-field" id={id}>{$formStore.inductee || '&nbsp;'}</div>
      {/if}
    </FormRow>

    <FormRow label="Building" let:id>
      {#if $formConfigStore.editable.building}
        <input type="text" id={id} bind:value={$formStore.building} />
      {:else}
        <div class="readonly-field" id={id}>{$formStore.building || '&nbsp;'}</div>
      {/if}
    </FormRow>

    <FormRow label="Assignment" let:id>
      {#if $formConfigStore.editable.assignment}
        <input type="text" id={id} bind:value={$formStore.assignment} />
      {:else}
        <div class="readonly-field" id={id}>{$formStore.assignment || '&nbsp;'}</div>
      {/if}
    </FormRow>

    <FormRow label="Mentor Teacher" let:id>
      {#if $formConfigStore.editable.mentorTeacher}
        <input type="text" id={id} bind:value={$formStore.mentorTeacher} />
      {:else}
        <div class="readonly-field" id={id}>{$formStore.mentorTeacher || '&nbsp;'}</div>
      {/if}
    </FormRow>

    <FormRow label="School Year (Year 1)" let:id>
      {#if $formConfigStore.editable.schoolYearOne}
        <input type="text" id={id} bind:value={$formStore.schoolYearOne} placeholder="YYYY-YYYY" />
      {:else}
        <div class="readonly-field" id={id}>{$formStore.schoolYearOne || '&nbsp;'}</div>
      {/if}
    </FormRow>

    <FormRow label="School Year (Year 2)" let:id>
      {#if $formConfigStore.editable.schoolYearTwo}
        <input type="text" id={id} bind:value={$formStore.schoolYearTwo} placeholder="YYYY-YYYY" />
      {:else}
        <div class="readonly-field" id={id}>{$formStore.schoolYearTwo || '&nbsp;'}</div>
      {/if}
    </FormRow>

  </fieldset>
  </div>

<style>
  /* Cover page section styles */
  .cover-page-section {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0;
    font-family: sans-serif;
    box-sizing: border-box;
  }

  /* Header styling */
  .header {
    text-align: center;
    margin-bottom: 20px;
    width: 100%;
    position: relative;
    padding: 10px 0;
  }

  .header h2 {
    font-size: 1.6em;
    margin: 5px 0;
    font-weight: normal;
  }
  
  .header h3 {
    font-size: 1.3em;
    margin: 5px 0;
    font-weight: normal;
  }

  /* Form fieldset styling with improved spacing */
  .inductee-info {
    border: 1px solid #FFFF;
    padding: 25px 40px; /* Increased padding for better spacing */
    margin: 0;
    border-radius: 8px;
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 60px; /* Increased column gap */
    row-gap: 20px; /* Explicit row gap */
  }

  .inductee-info legend {
    font-weight: bold;
    padding: 0 15px; /* Increased padding around legend text */
    font-size: 1.1em;
    margin-left: 15px;
  }

  /* Improved styling for input fields and readonly fields */
  input[type="text"],
  .readonly-field {
    width: 100%;
    padding: 10px 12px; /* Slightly increased padding */
    border: 1px solid #bbb; /* Lighter border */
    border-radius: 4px;
    font-size: 1em;
    font-family: inherit;
    box-sizing: border-box;
    min-height: 40px; /* Slightly taller for better visual presence */
    display: flex;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05); /* Subtle shadow for depth */
    transition: border-color 0.2s; /* Smooth transition for hover/focus */
  }

  /* Specific style enhancements for inputs when editable */
  input[type="text"] {
    background-color: #fff;
  }

  input[type="text"]:focus {
    border-color: #999;
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.1);
  }

  /* Specific style enhancements for readonly fields */
  .readonly-field {
    background-color: #f8f8f8;
    color: #444; /* Slightly darker for better contrast */
  }

  /* Placeholder for empty readonly fields */
   .readonly-field:empty::after {
     content: '\00a0';
  }

  /* Responsive adjustments with improved breakpoints */
  @media screen and (min-width: 900px) {
    .inductee-info {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px 40px;
    }
  }

  /* Three-column layout for very wide screens */
  @media screen and (min-width: 1300px) {
    .inductee-info {
      grid-template-columns: repeat(3, 1fr);
      gap: 20px 30px;
    }
  }

  @media screen and (max-width: 600px) {
    .cover-page-section {
      padding: 10px 5px;
      width: 100%;
      max-width: none;
    }
    
    .header {
      margin-bottom: 15px;
      padding: 5px 0;
    }
    
    .header h2 {
      font-size: 1.2em;
    }
    
    .header h3 {
      font-size: 1.1em;
    }
    
    .inductee-info {
      padding: 15px 20px;
    }
    
    input[type="text"],
    .readonly-field {
      font-size: 0.95em;
      min-height: 38px;
    }
  }
</style>
