<svelte:options customElement="ps-cover-page-wrapper" />

<script lang="ts">
  import CoverPage from './CoverPage.svelte';
  import { setContext } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let formStore: Writable<any>;
  export let formConfigStore: Writable<any>;

  setContext('formStore', formStore);
  setContext('formConfigStore', formConfigStore);
</script>

<CoverPage />