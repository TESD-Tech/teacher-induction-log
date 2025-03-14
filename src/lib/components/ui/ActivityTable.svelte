<script lang="ts">
  export let headers: string[] = [];
  export let showActions: boolean = true;
</script>

<table>
  <thead>
    <tr>
      {#each headers as header}
        <th>{header}</th>
      {/each}
      {#if showActions}
        <th class="actions-column">Actions</th>
      {/if}
    </tr>
  </thead>
  <tbody>
    <slot></slot>
  </tbody>
</table>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th {
    border: 1px solid #000;
    padding: 8px;
    text-align: left;
    font-weight: bold;
    background-color: #f2f2f2;
  }

  /* Print-specific styles */
  @media print {
    .actions-column {
      display: none;
    }
  }
</style>
