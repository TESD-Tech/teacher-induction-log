<svelte:options customElement="ps-generic-section" />

<script lang="ts">
  import { formStore, formConfigStore } from '../../stores/formStore';
  import { canEdit } from '../../permissions';
  import LogSection from '../ui/LogSection.svelte';
  import ActivityTable from '../ui/ActivityTable.svelte';
  import Button from '../ui/Button.svelte';
  import DateInput from '../ui/DateInput.svelte';
  import type { SectionConfig } from '../../config/sectionConfigs';
  import Add from "carbon-icons-svelte/lib/Add.svelte";
  import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
  
  // Props
  export let config: SectionConfig;
  
  // Get the action handlers from the store
  const getActionHandler = (handlerName: string) => {
    switch (handlerName) {
      case 'addMentorMeeting': return () => import('../../stores/formStore').then(m => m.addMentorMeeting());
      case 'removeMentorMeeting': return (index: number) => import('../../stores/formStore').then(m => m.removeMentorMeeting(index));
      case 'addTeamMeeting': return () => import('../../stores/formStore').then(m => m.addTeamMeeting());
      case 'removeTeamMeeting': return (index: number) => import('../../stores/formStore').then(m => m.removeTeamMeeting(index));
      case 'addClassroomVisit': return () => import('../../stores/formStore').then(m => m.addClassroomVisit());
      case 'removeClassroomVisit': return (index: number) => import('../../stores/formStore').then(m => m.removeClassroomVisit(index));
      case 'addOtherActivity': return () => import('../../stores/formStore').then(m => m.addOtherActivity());
      case 'removeOtherActivity': return (index: number) => import('../../stores/formStore').then(m => m.removeOtherActivity(index));
      default: return () => console.error(`Handler ${handlerName} not found`);
    }
  };
  
  // Get data from the store based on section config
  $: sectionData = $formStore[config.dataKey] || [];
  
  // Check if a field is editable
  
  // Update verification column title to a shorter version
  $: modifiedHeaders = config.headers.map(header => 
    header === "Verification" ? "Initials" : header
  );
</script>

<LogSection title={config.title}>
  <ActivityTable 
    headers={modifiedHeaders} 
    columnWidths={config.columnWidths}
    showActions={!!config.actions?.remove}
    sectionId={config.id}
  >
    {#each sectionData as item, i (i)}
      <tr>
        {#each config.fields as field (field.key)}
          <td class={`field-type-${field.type}`}> 
            {#if field.type === 'static'}
              <div class="static-field">{item[field.key]}</div>
            {:else if field.type === 'date'}
              <DateInput 
                bind:value={item[field.key]} 
                readonly={!canEdit($formConfigStore.userRole, config.id, field.key)}
              />
            {:else if field.type === 'text'}
              {#if canEdit($formConfigStore.userRole, config.id, field.key)}
                <input
                  type="text" 
                  bind:value={item[field.key]} 
                  placeholder={field.placeholder || ''} 
                />
              {:else}
                <div class="readonly-field">{item[field.key]}</div>
              {/if}
            {:else if field.type === 'verification'}
              {#if canEdit($formConfigStore.userRole, config.id, field.key)}
                <input
                  type="text" 
                  bind:value={item[field.key]} 
                  placeholder={field.placeholder || 'Initials'} 
                />
              {:else}
                <div class="readonly-field">{item[field.key]}</div>
              {/if}
            {/if}
          </td>
        {/each}
        {#if config.actions?.remove}
          <td class="actions-cell">
            <Button 
              variant="remove" 
              compact={true}
              confirmMessage={config.actions.remove.confirmMessage} 
              on:click={() => getActionHandler(config.actions.remove.handler)(i)}
            >
              <span class="icon"><TrashCan size={16} /></span>
              <span class="button-text">Remove</span>
            </Button>
          </td>
        {/if}
      </tr>
    {/each}
  </ActivityTable>
  {#if config.actions?.add}
    <Button 
      variant="add" 
      on:click={getActionHandler(config.actions.add.handler)}
    >
      <span class="icon"><Add size={16} /></span>
      {config.actions.add.label}
    </Button>
  {/if}
</LogSection>

<style>
  input[type="text"], .readonly-field, .static-field {
    border: none;
    border-bottom: 1px solid var(--input-border, #ccc);
    padding: 0.5rem;
    width: 100%;
    font-family: inherit;
    background: transparent;
    box-sizing: border-box;
    display: block;
    margin: 0;
    height: 36px;
    font-size: 0.95rem;
  }
  
  input[type="text"]:focus {
    outline: none;
    border-bottom: 2px solid var(--focus-color, #007bff);
  }
  
  .readonly-field, .static-field {
    background-color: #f8f9fa;
    display: flex;
    align-items: center;
    border-radius: 4px;
    padding-left: 0.5rem;
  }
  
  .static-field {
    font-weight: 500;
  }
  
  td {
    padding: 0.75rem 1rem;
    vertical-align: middle;
    border-bottom: 1px solid var(--table-border, #eee);
    background-color: white;
    overflow: visible;
    box-sizing: border-box;
  }

  /* Specific styling for different field types */
  .field-type-static {
    width: 80px;
  }

  .field-type-date {
    width: 160px;
    min-width: 160px;
  }

  .field-type-text {
    min-width: 180px;
  }

  .field-type-verification {
    width: 90px;
  }

  .actions-cell {
    text-align: center;
    vertical-align: middle;
    width: 110px;
  }

  .icon {
    display: inline-flex;
    align-items: center;
    margin-right: 0.25rem;
    vertical-align: middle;
  }
  
  .icon :global(svg) {
    fill: currentColor;
  }
  
  /* Responsive adjustments for small screens */
  @media screen and (max-width: 480px) {
    .button-text {
      display: none;
    }
    
    .icon {
      margin-right: 0;
    }
    
    input[type="text"], .readonly-field, .static-field {
      font-size: 0.9rem;
      padding: 0.375rem;
    }

    td {
      padding: 0.5rem 0.75rem;
    }
  }

  /* Print styles */
  @media print {
    td {
      border-bottom: 1px solid #000;
    }
  }
</style>
