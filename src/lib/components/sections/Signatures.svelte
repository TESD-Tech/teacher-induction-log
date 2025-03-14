<script lang="ts">
  import { formStore } from '../../stores/formStore';
</script>

<div class="signature-section">
  <p>These signatures certify that the above named inductee has completed the requirements of the Tredyffrin/Easttown New Staff Induction Program.</p>
  
  <div class="signature-row">
    <div class="signature-field">
      <input type="text" id="mentor-teacher" bind:value={$formStore.signatures.mentorTeacher} />
      <label for="mentor-teacher">Mentor Teacher</label>
    </div>
    <div class="signature-field">
      <input type="text" id="building-principal" bind:value={$formStore.signatures.buildingPrincipal} />
      <label for="building-principal">Building Principal</label>
    </div>
  </div>
  
  <div class="signature-row">
    <div class="signature-field">
      <input type="text" id="superintendent" bind:value={$formStore.signatures.superintendent} />
      <label for="superintendent">Superintendent</label>
    </div>
    <div class="signature-field">
      <input type="text" id="signature-date" bind:value={$formStore.signatures.date} />
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

  input[type="text"] {
    border: none;
    border-bottom: 1px solid #000;
    padding: 5px;
    width: 100%;
    font-family: inherit;
    background: transparent;
  }

  .note {
    font-style: italic;
    margin-top: 20px;
    text-align: center;
  }
</style>
