<script lang="ts">
  import { formStore, formConfigStore } from '../../stores/formStore';
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
  const isEditable = (fieldKey: string, itemType: string) => {
    if (fieldKey === 'verification') {
      return $formConfigStore.editable.verifications[itemType];
    }
    return $formConfigStore.editable[itemType];
  };
</script>

<LogSection title={config.title}>
  <ActivityTable 
    headers={config.headers} 
    columnWidths={config.columnWidths}
    showActions={!!config.actions?.remove}>
    {#each sectionData as item, i}
      <tr>
        {#each config.fields as field}
          <td>
            {#if field.type === 'static'}
              <div class="static-field">{item[field.key]}</div>
            {:else if field.type === 'date'}
              <DateInput 
                bind:value={item[field.key]} 
                readonly={!isEditable(field.key, config.id)} 
              />
            {:else if field.type === 'text'}
              {#if isEditable(field.key, config.id)}
                <input 
                  type="text" 
                  bind:value={item[field.key]} 
                  placeholder={field.placeholder || ''} 
                />
              {:else}
                <div class="readonly-field">{item[field.key]}</div>
              {/if}
            {:else if field.type === 'verification'}
              {#if isEditable(field.key, config.id)}
                <input 
                  type="text" 
                  bind:value={item[field.key]} 
                  placeholder={field.placeholder || 'Mentor initials'} 
                />
              {:else}
                <div class="readonly-field">{item[field.key]}</div>
              {/if}
            {/if}
          </td>
        {/each}
        
        {#if config.actions?.remove}
          <td>
            <Button 
              variant="remove" 
              confirmMessage={config.actions.remove.confirmMessage} 
              on:click={() => getActionHandler(config.actions.remove.handler)(i)}
            >
              <span class="icon"><TrashCan size={16} /></span>
              Remove
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
    border-bottom: 1px solid var(--input-border);
    padding: 8px;
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
    border-bottom: 2px solid var(--focus-color);
  }
  
  .readonly-field, .static-field {
    background-color: #f8f9fa;
    display: flex;
    align-items: center;
    border-radius: 4px;
    padding-left: 8px;
  }
  
  .static-field {
    font-weight: 500;
  }
  
  td {
    padding: 10px;
    vertical-align: middle;
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
</style>
