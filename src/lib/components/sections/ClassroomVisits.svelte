<script lang="ts">
  import { formStore, addClassroomVisit, removeClassroomVisit } from '../../stores/formStore';
  import LogSection from '../ui/LogSection.svelte';
  import ActivityTable from '../ui/ActivityTable.svelte';
  import Button from '../ui/Button.svelte';
</script>

<LogSection title="V. Visits to other classrooms">
  <ActivityTable headers={['Date', 'Teacher', 'Subject', 'Date (Year 1)', 'Date (Year 2)', 'Verification']}>
    {#each $formStore.classroomVisits as visit, i}
      <tr>
        <td><input type="text" bind:value={visit.date} /></td>
        <td><input type="text" bind:value={visit.teacher} /></td>
        <td><input type="text" bind:value={visit.subject} /></td>
        <td><input type="text" bind:value={visit.dateYearOne} /></td>
        <td><input type="text" bind:value={visit.dateYearTwo} /></td>
        <td><input type="text" bind:value={visit.verification} /></td>
        <td>
          <Button variant="remove" on:click={() => removeClassroomVisit(i)}>Remove</Button>
        </td>
      </tr>
    {/each}
  </ActivityTable>
  <Button variant="add" on:click={addClassroomVisit}>Add Visit</Button>
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
