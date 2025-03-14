<script lang="ts">
  import { formStore } from '../../stores/formStore';
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
      <input type="text" id={id} bind:value={$formStore.inductee} />
    </FormRow>
    
    <FormRow label="Building" let:id>
      <input type="text" id={id} bind:value={$formStore.building} />
    </FormRow>
    
    <FormRow label="Assignment" let:id>
      <input type="text" id={id} bind:value={$formStore.assignment} />
    </FormRow>
    
    <FormRow label="Mentor Teacher" let:id>
      <input type="text" id={id} bind:value={$formStore.mentorTeacher} />
    </FormRow>
    
    <FormRow label="School Year (Year 1)" let:id>
      <input type="text" id={id} bind:value={$formStore.schoolYearOne} />
    </FormRow>
    
    <FormRow label="School Year (Year 2)" let:id>
      <input type="text" id={id} bind:value={$formStore.schoolYearTwo} />
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
