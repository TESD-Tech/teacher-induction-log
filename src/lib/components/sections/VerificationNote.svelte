<svelte:options customElement="ps-verification-note" />

<script lang="ts">
  export const userType: string | undefined = undefined;
</script>

<div class="verification-note">
  <p>On the date of each activity, this log must be initialed by the mentor teacher, principal or seminar coordinator.</p>
</div>

<style>
  .verification-note {
    font-style: italic;
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    page-break-inside: avoid;
  }
</style>
