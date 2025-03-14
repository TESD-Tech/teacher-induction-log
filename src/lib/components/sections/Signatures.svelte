<script lang="ts">
  import { formStore, formConfigStore } from '../../stores/formStore';
  import DateInput from '../ui/DateInput.svelte';
</script>

<div class="signature-section">
  <p>These signatures certify that the above named inductee has completed the requirements of the Tredyffrin/Easttown New Staff Induction Program.</p>
  
  <div class="signature-row">
    <div class="signature-field">
      {#if $formConfigStore.editable.signatures}
        <input type="text" id="mentor-teacher" bind:value={$formStore.signatures.mentorTeacher} />
      {:else}
        <div class="readonly-field" id="mentor-teacher">{$formStore.signatures.mentorTeacher}</div>
      {/if}
      <label for="mentor-teacher">Mentor Teacher</label>
    </div>
    <div class="signature-field">
      {#if $formConfigStore.editable.signatures}
        <input type="text" id="building-principal" bind:value={$formStore.signatures.buildingPrincipal} />
      {:else}
        <div class="readonly-field" id="building-principal">{$formStore.signatures.buildingPrincipal}</div>
      {/if}
      <label for="building-principal">Building Principal</label>
    </div>
  </div>
  
  <div class="signature-row">
    <div class="signature-field">
      {#if $formConfigStore.editable.signatures}
        <input type="text" id="superintendent" bind:value={$formStore.signatures.superintendent} />
      {:else}
        <div class="readonly-field" id="superintendent">{$formStore.signatures.superintendent}</div>
      {/if}
      <label for="superintendent">Superintendent</label>
    </div>
    <div class="signature-field">
      <div id="signature-date">
        <DateInput 
          bind:value={$formStore.signatures.date} 
          readonly={!$formConfigStore.editable.signatures} 
        />
      </div>
      <label for="signature-date">Date</label>
    </div>
  </div>
  
  <p class="note">This completed log must be returned to the Staff Development Office at the Tredyffrin/Easttown School District Administration Offices.</p>
</div>

<style>
  .signature-section {
    margin-top: 30px;
    border: 1px solid #000;
    padding: 15px;
    page-break-inside: avoid;
  }

  .signature-row {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }

  .signature-field {
    width: 45%;
    display: flex;
    flex-direction: column;
  }

  .signature-field label {
    text-align: center;
    margin-top: 5px;
    font-weight: bold;
  }

  input[type="text"], .readonly-field {
    border: none;
    border-bottom: 1px solid #000;
    padding: 5px;
    width: 100%;
    font-family: inherit;
    background: transparent;
    box-sizing: border-box;
    display: block;
    margin: 0;
    height: 30px;
  }
  
  .readonly-field {
    background-color: #f8f8f8;
    display: flex;
    align-items: center;
  }

  .note {
    font-style: italic;
    margin-top: 20px;
    text-align: center;
  }
</style>
