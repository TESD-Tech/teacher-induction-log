<svelte:options customElement="ps-log-section" />

<script lang="ts">
  export let title: string;
</script>

<section class="log-section">
  <h3 class="section-title">{title}</h3>
  <div class="section-content">
    <slot></slot>
  </div>
</section>

<style>
  .log-section {
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
  }
  
  .section-title {
    margin-top: 0;
    margin-bottom: 1.25rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }
  
  .section-content {
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  
  /* Print-specific styles */
  @media print {
    .log-section {
      box-shadow: none;
      border: 1px solid #000;
      page-break-inside: avoid;
      margin-bottom: 0.75rem;
      padding: 0.75rem;
    }
    
    .section-title {
      font-size: 14pt;
      border-bottom: 1px solid #000;
    }
  }
  
  /* Responsive adjustments */
  @media screen and (max-width: 768px) {
    .log-section {
      padding: 1rem;
      margin-bottom: 1rem;
    }
    
    .section-title {
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }
  }
</style>
