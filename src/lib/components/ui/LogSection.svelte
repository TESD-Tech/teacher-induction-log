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
    border: 1px solid var(--border-color);
    padding: 20px 25px;
    page-break-inside: avoid;
    width: 100%;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 0.75rem;
  }
</style>
