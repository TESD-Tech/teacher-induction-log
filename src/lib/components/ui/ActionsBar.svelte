<script lang="ts">
  import { printForm, saveForm } from '../../stores/formStore';
  import Button from './Button.svelte';
</script>

<div class="actions">
  <Button on:click={printForm}>Print Form</Button>
  <Button on:click={saveForm}>Save Form</Button>
</div>

<style>
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }

  @media print {
    .actions {
      display: none;
    }
  }
</style>
