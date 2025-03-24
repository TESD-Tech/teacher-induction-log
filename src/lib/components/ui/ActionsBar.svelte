<script lang="ts">
  import { printForm, saveForm } from '../../stores/formStore';
  import Button from './Button.svelte';
  import Printer from "carbon-icons-svelte/lib/Printer.svelte";
  import Save from "carbon-icons-svelte/lib/Save.svelte";
</script>

<div class="actions">
  <Button on:click={printForm} class="action-button">
    <span class="icon"><Printer size={16} /></span> Print Form
  </Button>
  <Button on:click={saveForm} class="action-button primary">
    <span class="icon"><Save size={16} /></span> Save Form
  </Button>
</div>

<style>
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
  }
  
  .icon {
    display: inline-flex;
    align-items: center;
    margin-right: 0.5rem;
    vertical-align: middle;
  }
  
  .icon :global(svg) {
    fill: currentColor;
  }

  @media print {
    .actions {
      display: none;
    }
  }
</style>
