<svelte:options customElement="ps-activity-table" />

<script lang="ts">
  export let headers: string[] = [];
  export let columnWidths: string[] = [];
</script>

<div class="table-container">
  <table>
    <thead>
      <tr>
        {#each headers as header, i}
          <th style={columnWidths[i] ? `width: ${columnWidths[i]}` : ''}>{header}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      <slot></slot>
    </tbody>
  </table>
</div>

<style>
  .table-container {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 1.5rem;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: relative; /* For the scrollbar indicator */
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    border: 1px solid var(--table-border, #ddd);
    border-radius: 6px;
    background-color: white;
  }

  th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    background-color: var(--header-bg, #f5f5f5);
    border-bottom: 2px solid var(--table-border, #ddd);
    color: #495057;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    vertical-align: middle;
  }

  /* Actions column specific styling */
  :global(.actions-column) {
    width: 110px;
    text-align: center;
  }

  /* Handle edge case with overflow in headers */
  th::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1.5rem;
    background: linear-gradient(to right, transparent, var(--header-bg, #f5f5f5));
    opacity: 0;
    pointer-events: none;
  }

  th:hover::after {
    opacity: 1;
  }

  /* Print-specific styles */
  @media print {
    :global(.actions-column) {
      display: none;
    }
    
    table {
      box-shadow: none;
      border: 1px solid #000;
      width: 100% !important;
    }
    
    th {
      border-bottom: 1px solid #000;
    }

    .table-container {
      overflow-x: visible;
      box-shadow: none;
      border-radius: 0;
    }
  }

  /* Small screen adjustments */
  @media screen and (max-width: 768px) {
    .table-container {
      border-radius: 6px;
    }
    
    /* Indicate scroll affordance on mobile */
    .table-container::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 20px;
      background: linear-gradient(to right, rgba(255,255,255,0), rgba(0,0,0,0.05));
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .table-container:hover::after {
      opacity: 1;
    }
  }
</style>
