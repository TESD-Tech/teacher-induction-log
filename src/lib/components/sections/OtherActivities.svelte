<script lang="ts">
  import { formStore, addOtherActivity, removeOtherActivity } from '../../stores/formStore';
  import LogSection from '../ui/LogSection.svelte';
  import ActivityTable from '../ui/ActivityTable.svelte';
  import Button from '../ui/Button.svelte';
</script>

<LogSection title="VI. Other: conferences, courses, etc.">
  <ActivityTable headers={['Date', 'Activity', 'Date (Year 1)', 'Date (Year 2)', 'Verification']}>
    {#each $formStore.otherActivities as activity, i}
      <tr>
        <td><input type="text" bind:value={activity.date} /></td>
        <td><input type="text" bind:value={activity.activity} /></td>
        <td><input type="text" bind:value={activity.dateYearOne} /></td>
        <td><input type="text" bind:value={activity.dateYearTwo} /></td>
        <td><input type="text" bind:value={activity.verification} /></td>
        <td>
          <Button variant="remove" on:click={() => removeOtherActivity(i)}>Remove</Button>
        </td>
      </tr>
    {/each}
  </ActivityTable>
  <Button variant="add" on:click={addOtherActivity}>Add Activity</Button>
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
