<script lang="ts">
  import { formStore, formConfigStore } from '../../stores/formStore';
  import FormRow from '../ui/FormRow.svelte';
</script>

<div class="cover-page">
  <div class="header">
    <h1>TREDYFFRIN/EASTTOWN SCHOOL DISTRICT</h1>
    <h2>Teacher Induction Log</h2>
    <h3>Log Sheet</h3>
  </div>

  <div class="inductee-info">
    <FormRow label="Inductee" let:id>
      {#if $formConfigStore.editable.inductee}
        <input type="text" id={id} bind:value={$formStore.inductee} />
      {:else}
        <div class="readonly-field" id={id}>{$formStore.inductee}</div>
      {/if}
    </FormRow>
    
    <FormRow label="Building" let:id>
      {#if $formConfigStore.editable.building}
        <input type="text" id={id} bind:value={$formStore.building} />
      {:else}
        <div class="readonly-field" id={id}>{$formStore.building}</div>
      {/if}
    </FormRow>
    
    <FormRow label="Assignment" let:id>
      {#if $formConfigStore.editable.assignment}
        <input type="text" id={id} bind:value={$formStore.assignment} />
      {:else}
        <div class="readonly-field" id={id}>{$formStore.assignment}</div>
      {/if}
    </FormRow>
    
    <FormRow label="Mentor Teacher" let:id>
      {#if $formConfigStore.editable.mentorTeacher}
        <input type="text" id={id} bind:value={$formStore.mentorTeacher} />
      {:else}
        <div class="readonly-field" id={id}>{$formStore.mentorTeacher}</div>
      {/if}
    </FormRow>
    
    <FormRow label="School Year (Year 1)" let:id>
      {#if $formConfigStore.editable.schoolYearOne}
        <input type="text" id={id} bind:value={$formStore.schoolYearOne} />
      {:else}
        <div class="readonly-field" id={id}>{$formStore.schoolYearOne}</div>
      {/if}
    </FormRow>
    
    <FormRow label="School Year (Year 2)" let:id>
      {#if $formConfigStore.editable.schoolYearTwo}
        <input type="text" id={id} bind:value={$formStore.schoolYearTwo} />
      {:else}
        <div class="readonly-field" id={id}>{$formStore.schoolYearTwo}</div>
      {/if}
    </FormRow>
  </div>
</div>

<style>
  .cover-page {
    page-break-after: always;
  }
  
  .header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .readonly-field {
    padding: 0.6em;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f8f8f8;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 30px;
    margin: 0;
  }

  .header h1 {
    font-size: 20px;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .header h2, .header h3 {
    font-size: 18px;
    margin: 5px 0;
  }

  input[type="text"] {
    border: none;
    border-bottom: 1px solid #000;
    padding: 5px;
    width: 100%;
    font-family: inherit;
    background: transparent;
  }
</style>
