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
    align-items: center; /* Vertically center label and input */
    gap: 0.75rem; /* Explicitly set space between label and input */
    /* Removed margin-bottom: rely on parent grid gap for vertical spacing */
  }

  label {
    width: 160px;      /* ADJUST THIS value based on visual results */
    flex-shrink: 0;   /* Ensure label doesn't shrink */
    font-weight: bold;
    text-align: right; /* Align label text to the right */
  }

  .input-container {
    flex-grow: 1;     /* Allow input container to take remaining space */
    /* flex-basis: 0; */ /* Consider adding if needed, often default */
    min-width: 0;     /* Helps prevent overflow issues with content in flex items */
  }
</style>