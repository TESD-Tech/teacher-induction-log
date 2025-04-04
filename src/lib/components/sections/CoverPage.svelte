<script lang="ts">
  import { formStore, formConfigStore } from '../../stores/formStore';
  import FormRow from '../ui/FormRow.svelte'; // Assuming FormRow handles label and input layout
</script>

<div class="cover-page-section">
  <header class="header">
    <h1>TREDYFFRIN/EASTTOWN SCHOOL DISTRICT</h1>
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
  /* Renamed outer class slightly for clarity */
  .cover-page-section {
    /* Removed page-break-after as it might be controlled by the parent */
    max-width: 800px; /* Adjust as needed */
    margin: 20px auto; /* Center with some top/bottom margin */
    padding: 15px;
    font-family: sans-serif; /* Example font */
    box-sizing: border-box;
  }

  /* Header styling */
  .header {
    text-align: center;
    margin-bottom: 40px; /* Increased spacing */
  }

  .header h1 {
    font-size: 1.4em; /* Use em for relative sizing */
    margin-bottom: 5px;
    font-weight: bold;
  }

  .header h2, .header h3 {
    font-size: 1.2em;
    margin: 5px 0;
    font-weight: normal; /* Less emphasis than h1 */
  }

  /* Form fieldset styling */
  .inductee-info {
    border: 1px solid #FFFF; /* Style the fieldset border */
    padding: 20px;
    margin: 0; /* Reset default fieldset margin */
    border-radius: 8px;
    display: grid;
    /* Default to single column */
    grid-template-columns: 1fr;
    gap: 15px; /* Spacing between rows */
  }

  .inductee-info legend {
    font-weight: bold;
    padding: 0 10px; /* Spacing around legend text */
    font-size: 1.1em;
    margin-left: 10px; /* Align legend nicely */
  }

  /* Shared styling for input and readonly fields */
  input[type="text"],
  .readonly-field {
    width: 100%;
    padding: 8px 10px; /* Consistent padding */
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1em;
    font-family: inherit;
    box-sizing: border-box; /* Include padding/border in width */
    min-height: 38px; /* Ensure minimum height consistency */
    display: flex; /* For readonly vertical alignment */
    align-items: center; /* For readonly vertical alignment */
  }

  /* Specific style for inputs when editable */
  input[type="text"] {
    background-color: #fff;
  }

  /* Specific style for readonly fields */
  .readonly-field {
    background-color: #f8f8f8;
    /* color: #555; Optional: slightly muted text color */
  }

  /* Placeholder for empty readonly fields */
   .readonly-field:empty::after {
     content: '\00a0'; /* Non-breaking space to maintain height */
  }

  /* Responsive adjustments */
  @media screen and (min-width: 600px) {
    /* Use two columns on wider screens */
    .inductee-info {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px 30px; /* Row gap, Column gap */
    }
  }

  @media screen and (max-width: 600px) {
    .cover-page-section { /* Adjusted class name here too */
      padding: 10px;
    }
    .header h1 {
      font-size: 1.2em;
    }
    .header h2, .header h3 {
      font-size: 1.1em;
    }
    input[type="text"],
    .readonly-field {
       font-size: 0.95em; /* Slightly smaller font on mobile */
    }
  }
</style>