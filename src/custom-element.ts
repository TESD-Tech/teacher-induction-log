import { mount } from 'svelte';
import App from './App.svelte';
// Import styles but don't apply them to the document
// We'll manually inject them into the shadow DOM
import styles from './app.css?inline';
// Import form configuration types
import type { FormConfig, FormData, EditabilityState } from './lib/stores/formStore';

// Dynamically determine the package name from the base URL
function getPackageName(): string {
  // Get the base URL from import.meta
  const baseUrl = import.meta.env.BASE_URL || '/';
  // Remove leading and trailing slashes
  const cleanedBase = baseUrl.replace(/^\/|\/$/g, '');
  // If there's a value, use it; otherwise fall back to a default
  return cleanedBase || 'ps-svelte';
}

export class SvelteAppElement extends HTMLElement {
  private shadow: ShadowRoot;
  private app: any;
  private formConfig: FormConfig | null = null;

  static get observedAttributes() {
    return ['data', 'editable', 'user-role'];
  }

  constructor() {
    super();
    // Create a shadow DOM for style encapsulation
    this.shadow = this.attachShadow({ mode: 'open' });
    
    // Inject the global styles into the shadow DOM
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    this.shadow.appendChild(styleElement);
    
    // Create container for the Svelte app
    const appContainer = document.createElement('div');
    appContainer.id = 'svelte-app-container';
    this.shadow.appendChild(appContainer);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    
    try {
      if (name === 'data' && newValue) {
        const data = JSON.parse(newValue) as FormData;
        if (!this.formConfig) {
          this.formConfig = {
            data,
            editable: this.getDefaultEditabilityState(),
            userRole: 'teacher'
          };
        } else {
          this.formConfig.data = data;
        }
      } else if (name === 'editable' && newValue) {
        const editable = JSON.parse(newValue) as EditabilityState;
        if (!this.formConfig) {
          this.formConfig = {
            data: this.getDefaultFormData(),
            editable,
            userRole: 'teacher'
          };
        } else {
          this.formConfig.editable = editable;
        }
      } else if (name === 'user-role' && newValue) {
        const userRole = newValue as 'admin' | 'teacher';
        if (!this.formConfig) {
          this.formConfig = {
            data: this.getDefaultFormData(),
            editable: this.getDefaultEditabilityState(),
            userRole
          };
        } else {
          this.formConfig.userRole = userRole;
        }
      }
    } catch (error) {
      console.error(`Error parsing attribute ${name}:`, error);
    }
  }

  private getDefaultFormData(): FormData {
    return {
      inductee: "",
      building: "",
      assignment: "",
      mentorTeacher: "",
      schoolYearOne: "",
      schoolYearTwo: "",
      summerAcademy: [
        { day: "Day 1", dateYearOne: "", dateYearTwo: "", verification: "" },
        { day: "Day 2", dateYearOne: "", dateYearTwo: "", verification: "" },
        { day: "Day 3", dateYearOne: "", dateYearTwo: "", verification: "" },
        { day: "Day 4", dateYearOne: "", dateYearTwo: "", verification: "" }
      ],
      inductionSeminars: [
        { number: 1, topic: "", dateYearOne: "", dateYearTwo: "", verification: "" },
        { number: 2, topic: "", dateYearOne: "", dateYearTwo: "", verification: "" },
        { number: 3, topic: "", dateYearOne: "", dateYearTwo: "", verification: "" },
        { number: 4, topic: "", dateYearOne: "", dateYearTwo: "", verification: "" }
      ],
      mentorMeetings: [],
      teamMeetings: [],
      classroomVisits: [],
      otherActivities: [],
      signatures: {
        mentorTeacher: "",
        buildingPrincipal: "",
        superintendent: "",
        date: ""
      }
    };
  }

  private getDefaultEditabilityState(): EditabilityState {
    return {
      inductee: true,
      building: true,
      assignment: true,
      mentorTeacher: true,
      schoolYearOne: true,
      schoolYearTwo: true,
      summerAcademy: true,
      inductionSeminars: true,
      mentorMeetings: true,
      teamMeetings: true,
      classroomVisits: true,
      otherActivities: true,
      signatures: true,
      // Add verification fields editability
      verifications: {
        summerAcademy: true,
        inductionSeminars: true,
        mentorMeetings: true,
        teamMeetings: true,
        classroomVisits: true,
        otherActivities: true
      }
    };
  }

  connectedCallback() {
    // Mount the Svelte app when the element is connected to the DOM
    this.app = mount(App, {
      target: this.shadow.getElementById('svelte-app-container')!,
      props: {
        formConfig: this.formConfig
      }
    });
  }

  disconnectedCallback() {
    // Clean up when the element is removed from the DOM
    if (this.app && typeof this.app.$destroy === 'function') {
      this.app.$destroy();
    }
  }
}

// Define the custom element with the package name as a prefix
const packageName = getPackageName();
const elementName = `${packageName}-app`;

// Log the custom element name for debugging
console.log(`Registering custom element: ${elementName}`);
customElements.define(elementName, SvelteAppElement);
