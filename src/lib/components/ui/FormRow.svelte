<script lang="ts">
  export let label: string;
  export let id: string = crypto.randomUUID();
</script>

<div class="form-row">
  <label for={id}>{label}</label>
  <div class="input-container">
    <slot {id}></slot>
  </div>
</div>

<style>
  .form-row {
    display: flex;
    margin-bottom: 15px;
    align-items: center;
  }

  label {
    width: 200px;
    font-weight: bold;
  }

  .input-container {
    flex: 1;
  }
</style>
