// Import the full application custom element
import './custom-element';

// Import the automatic component registration system
// This will automatically register all components in the src/lib directory as custom elements
import './lib-components';

// Import App component and mount function from Svelte
import App from './App.svelte';
import { mount as svelteMount } from 'svelte';
import type { FormConfig } from './lib/stores/formStore';

// Export a mount function that can be used to mount the app directly
export function mount(container: HTMLElement, config: FormConfig) {
  return svelteMount(App, {
    target: container,
    props: {
      formConfig: config
    }
  });
}

// Both the full application and individual components are now available as custom elements
// <ps-svelte-app> - The full application
// <svelte-counter> - The Counter component (automatically registered)
// Any new component added to src/lib will be automatically available as <svelte-componentname>
