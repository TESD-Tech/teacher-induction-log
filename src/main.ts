// src/main.ts (Revised Approach)
import './app.css'; // Global styles
import App from './App.svelte'; // Your main app component
import AdminPanel from './lib/AdminPanel.svelte'; // Import AdminPanel directly

console.log('Registering Svelte custom elements...');

// Use import.meta.glob to find and eagerly import components
const componentModules = import.meta.glob('/src/lib/components/**/*.svelte', { eager: true });

// Register components found by glob
for (const path in componentModules) {
  const component = componentModules[path].default;
  if (component && component.element) {
    // Extract tag name from svelte:options customElement
    // This assumes the customElement option is correctly set in each component
    const tagName = component.element.tagName;
    if (tagName && !customElements.get(tagName)) {
      customElements.define(tagName, component.element);
      console.log(`Registered <${tagName}>`);
    }
  }
}

// Register App.svelte explicitly if it is a custom element
if (App.element && !customElements.get(App.element.tagName)) {
  customElements.define(App.element.tagName, App.element);
  console.log(`Registered <${App.element.tagName}>`);
}

// AdminPanel is not a custom element, so we don't register it
// The AdminPanel component is used as a regular Svelte component

// --- Main Application Mounting ---
// This part remains largely the same, but now relies on the custom elements being registered
// by the above logic. The <ps-svelte-app> custom element is no longer needed as a wrapper
// if App.svelte itself is a custom element.
// The App.svelte component is now expected to be a custom element itself.
// The main application will be mounted by the custom element in index.html.
