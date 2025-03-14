<script lang="ts">
  export let title: string;
</script>

<div class="log-section">
  <h3>{title}</h3>
  <slot></slot>
</div>

<style>
  .log-section {
    margin-bottom: 30px;
    border: 1px solid #000;
    padding: 15px;
    page-break-inside: avoid;
  }

  h3 {
    margin-top: 0;
    font-size: 16px;
    font-weight: bold;
  }
</style>
