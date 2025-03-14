<script lang="ts">
  export let variant: 'default' | 'add' | 'remove' = 'default';
  export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

<button {type} class={variant} on:click>
  <slot></slot>
</button>

<style>
  button {
    padding: 5px 10px;
    margin: 5px;
    cursor: pointer;
    background-color: #f2f2f2;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button:hover {
    background-color: #e0e0e0;
  }

  button.add {
    background-color: #e6f7e6;
    border-color: #c3e6c3;
  }

  button.remove {
    background-color: #f7e6e6;
    border-color: #e6c3c3;
  }

  @media print {
    button {
      display: none;
    }
  }
</style>
