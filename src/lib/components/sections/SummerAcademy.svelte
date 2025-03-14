<script lang="ts">
  import { formStore } from '../../stores/formStore';
  import LogSection from '../ui/LogSection.svelte';
  import ActivityTable from '../ui/ActivityTable.svelte';
</script>

<LogSection title="I. Summer Academy">
  <ActivityTable headers={['Activity', 'Date (Year 1)', 'Date (Year 2)', 'Verification']} showActions={false}>
    {#each $formStore.summerAcademy as day}
      <tr>
        <td>{day.day}</td>
        <td><input type="text" bind:value={day.dateYearOne} /></td>
        <td><input type="text" bind:value={day.dateYearTwo} /></td>
        <td><input type="text" bind:value={day.verification} /></td>
      </tr>
    {/each}
  </ActivityTable>
</LogSection>

<style>
  input[type="text"] {
    border: none;
    border-bottom: 1px solid #000;
    padding: 5px;
    width: 100%;
    font-family: inherit;
    background: transparent;
  }
  
  td {
    border: 1px solid #000;
    padding: 8px;
    text-align: left;
  }
</style>
