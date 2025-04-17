// src/main.ts (Revised Approach)
import './app.css'; // Global styles
import App from './App.svelte'; // Your main app component

console.log('Importing component modules to trigger custom element registration...');

// Use import.meta.glob to find and eagerly import components
// This ensures the code runs and <svelte:options customElement="tag-name"> takes effect.
const componentModules = import.meta.glob('/src/lib/components/**/*.svelte', { eager: true });

// Log registered elements (might need a slight delay for registration to complete)
setTimeout(() => {
  console.log('Checking registrations:');
  console.log('ps-cover-page registered:', !!customElements.get('ps-cover-page'));
  // Add other elements you expect to be registered
}, 100);


// --- Main Application Mounting ---
// Keep your preferred method for mounting the main App
// e.g., using the <ps-svelte-app> custom element wrapper class (if App itself doesn't use <svelte:options>)
class PsSvelteApp extends HTMLElement {
  private _appInstance: App | null = null;
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    this._appInstance = new App({ target: shadow });
  }
  disconnectedCallback() {
    if (this._appInstance) {
      this._appInstance.$destroy();
      this._appInstance = null;
    }
  }
}
// Only define ps-svelte-app if App.svelte doesn't define its own tag via <svelte:options>
if (!customElements.get('ps-svelte-app')) {
     customElements.define('ps-svelte-app', PsSvelteApp);
     console.log('Registered <ps-svelte-app>');
}


// OR mounting directly (if not using <ps-svelte-app>)
/*
const app = new App({
  target: document.getElementById('app') || document.body,
});
export default app;
*/

// Note: No explicit `defineCustomElement` or `customElements.define` calls needed here
// for components using <svelte:options customElement="tag-name">