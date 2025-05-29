<script lang="ts">
  import ActivityTable from './ActivityTable.svelte';
  
  export let headers: string[] = [];
  export let columnWidths: string[] = [];
  export let emptyMessage: string = 'No activities to display.';
  export let testSlotContent: string = '';
</script>

<ActivityTable {headers} {columnWidths} {emptyMessage}>
  {#if testSlotContent}
    {@html testSlotContent}
  {/if}
</ActivityTable>
