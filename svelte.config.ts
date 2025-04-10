import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import type { Config } from '@sveltejs/kit';

const config: Config = {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  
  // Enable Svelte's built-in custom element support globally
  compilerOptions: {
    css: 'injected', // This ensures CSS is injected into the shadow DOM
    customElement: true
  }
};

export default config;
