<script lang="ts">
  import { formStore, addTeamMeeting, removeTeamMeeting } from '../../stores/formStore';
  import LogSection from '../ui/LogSection.svelte';
  import ActivityTable from '../ui/ActivityTable.svelte';
  import Button from '../ui/Button.svelte';
</script>

<LogSection title="IV. Induction team meetings">
  <ActivityTable headers={['Date', 'Topic', 'Date (Year 1)', 'Date (Year 2)', 'Verification']}>
    {#each $formStore.teamMeetings as meeting, i}
      <tr>
        <td><input type="text" bind:value={meeting.date} /></td>
        <td><input type="text" bind:value={meeting.topic} /></td>
        <td><input type="text" bind:value={meeting.dateYearOne} /></td>
        <td><input type="text" bind:value={meeting.dateYearTwo} /></td>
        <td><input type="text" bind:value={meeting.verification} /></td>
        <td>
          <Button variant="remove" on:click={() => removeTeamMeeting(i)}>Remove</Button>
        </td>
      </tr>
    {/each}
  </ActivityTable>
  <Button variant="add" on:click={addTeamMeeting}>Add Meeting</Button>
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
