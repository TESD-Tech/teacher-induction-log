<script lang="ts">
  export let headers: string[] = [];
  export let showActions: boolean = true;
  export let columnWidths: string[] = [];
</script>

<table>
  <thead>
    <tr>
      {#each headers as header, i}
        <th style={columnWidths[i] ? `width: ${columnWidths[i]}` : ''}>{header}</th>
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
    table-layout: fixed;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--table-border);
    border-radius: 6px;
    overflow: hidden;
  }

  th {
    padding: 12px 10px;
    text-align: left;
    font-weight: 600;
    background-color: var(--header-bg);
    border-bottom: 2px solid var(--table-border);
    color: #495057;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Actions column specific styling */
  .actions-column {
    width: 100px;
    text-align: center;
  }

  /* Print-specific styles */
  @media print {
    .actions-column {
      display: none;
    }
    
    table {
      box-shadow: none;
      border: 1px solid #000;
    }
    
    th {
      border-bottom: 1px solid #000;
    }
  }
</style>
