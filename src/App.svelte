<script lang="ts">
  import { onMount } from 'svelte';
  import InductionLog from './lib/InductionLog.svelte';
  import AdminPanel from './lib/AdminPanel.svelte';
  // Import both FormConfig and RawFormConfig for type safety
  import type { FormConfig, RawFormConfig } from './lib/stores/formStore'; 
  import { setFormConfig } from './lib/stores/formStore';
  import { fetchWithUrlParams } from './lib/utils/urlParams';
  import { isAdminView } from './lib/utils/nav';
  import './assets/global.css';
  import './assets/print.css';
  
  // State variables (now reactive)
  let config: FormConfig | undefined = $state(undefined); // Allow undefined initially
  let loading = $state(true);
  let error = $state(false);
  
  // Parse URL parameters for mentor view mode
  function parseUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      menteeId: urlParams.get('mentee'),
      viewMode: urlParams.get('view'),
      frn: urlParams.get('frn')
    };
  }

  // Determine the correct JSON endpoint based on the current URL
  function getConfigUrl(): string {
    const pathname = window.location.pathname;
    const baseUrl = window.location.origin;
    const urlParams = parseUrlParameters();
    
    let configUrl = '';
    
    // Check if this is mentor view mode
    if (urlParams.menteeId && urlParams.viewMode === 'mentor') {
      // Load mentee's data for mentor view
      configUrl = `${baseUrl}/teachers/teacher-induction-log/logs/${urlParams.menteeId}.json`;
      console.log(`[Mentor View] Loading mentee data for ID: ${urlParams.menteeId}`);
    } else if (pathname.includes('/admin/')) {
      configUrl = `${baseUrl}/admin/teacher-induction-log/log.json`;
    } else if (pathname.includes('/teachers/')) {
      configUrl = `${baseUrl}/teachers/teacher-induction-log/log.json`;
    } else {
      const base = import.meta.env.BASE_URL; 
      configUrl = `${base}log.json`; 
      console.log(`[Dev Env] Using base URL: ${base}. Fetching from: ${configUrl}`);
    }
    
    console.log('Config URL (before params):', configUrl);
    return configUrl;
  }
  
  // Load the configuration
  async function loadConfig() {
    loading = true; // Ensure loading is true at start
    error = false;
    let loadedConfig: FormConfig; 

    try {
      const configUrl = getConfigUrl();
      console.log('Fetching configuration from:', configUrl);
      
      // Use fetchWithUrlParams to automatically append URL parameters to .json endpoints
      const response = await fetchWithUrlParams(configUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch configuration: ${response.status} ${response.statusText}`);
      }
      
      const rawData = await response.json();
      console.log('Raw fetched data:', rawData);
      
      // The fetched data might be in RawFormConfig format (with JSON_CLOB array)
      // setFormConfig will handle the parsing automatically
      setFormConfig(rawData as RawFormConfig);
      
      // Get the processed config from the store for local state
      const { formConfigStore } = await import('./lib/stores/formStore');
      const unsubscribe = formConfigStore.subscribe((value: FormConfig) => {
        loadedConfig = value;
        config = value;
      });
      unsubscribe(); // Immediately unsubscribe since we just need the current value
      
      console.log('Successfully loaded and processed configuration:', loadedConfig);

    } catch (err) {
      console.error('Error loading configuration:', err);
      error = true;
      
      // --- UPDATED Fallback Configuration ---
      // Create a complete hardcoded configuration matching FormConfig interface
      const fallbackConfig: FormConfig = { 
        userRole: 'mentee', // Default role for fallback
        // Default options (can be empty or contain example values)
        options: { 
          mentors: ["Default Mentor A", "Default Mentor B"], 
          buildings: ["Default School"],
          assignments: ["Default Subject"],
          schoolYears: ["2024-2025", "2025-2026"] 
        },
        // Default editability (adjust as needed, e.g., all true for local fallback testing)
        editable: { 
          inductee: true, building: true, assignment: true, mentorTeacher: true,
          schoolYearOne: true, schoolYearTwo: true, summerAcademy: true,
          inductionSeminars: true, mentorMeetings: true, teamMeetings: true,
          classroomVisits: true, otherActivities: true, signatures: true
        },
        // Fallback data
        data: { 
          inductee: "Tester, Esther (Fallback Data)",
          building: "FALLBACK SCHOOL",
          assignment: "Fallback Assignment",
          mentorTeacher: "Default Mentor A",
          schoolYearOne: "2024-2025",
          schoolYearTwo: "2025-2026",
          summerAcademy: [
            { day: "Day 1", dateYearOne: "", dateYearTwo: "", verification: "" },
            { day: "Day 2", dateYearOne: "", dateYearTwo: "", verification: "" },
            { day: "Day 3", dateYearOne: "", dateYearTwo: "", verification: "" },
            { day: "Day 4", dateYearOne: "", dateYearTwo: "", verification: "" }
          ],
          inductionSeminars: [
            { number: 1, topic: "Fallback Seminar 1", dateYearOne: "", dateYearTwo: "", verification: "" },
            { number: 2, topic: "", dateYearOne: "", dateYearTwo: "", verification: "" },
            { number: 3, topic: "", dateYearOne: "", dateYearTwo: "", verification: "" },
            { number: 4, topic: "", dateYearOne: "", dateYearTwo: "", verification: "" }
          ],
          mentorMeetings: [
             { date: "", topic: "Fallback Meeting", dateYearOne: "", dateYearTwo: "", verification: "" }
          ],
          teamMeetings: [
             { date: "", topic: "Fallback Team Meeting", dateYearOne: "", dateYearTwo: "", verification: "" }
          ],
          classroomVisits: [
            { date: "", teacher: "", subject: "", dateYearOne: "", dateYearTwo: "", verification: "" }
          ],
          otherActivities: [
            { date: "", activity: "Fallback Activity", dateYearOne: "", dateYearTwo: "", verification: "" }
          ],
          signatures: {
            mentorTeacher: "", buildingPrincipal: "", superintendent: "", date: ""
          }
        }
      };
      
      // Update the form store with the complete fallback configuration
      setFormConfig(fallbackConfig); 
      config = fallbackConfig; // Update local state for conditional rendering
      
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    loadConfig();
  });
  
  // Svelte 5: Accept userType/user-type/user-role as a prop
  let { userType, userRole, usertype, 'user-type': userTypeAttr, 'user-role': userRoleAttr } = $props();

  // Compute the effective user type (reactive, Svelte 5 runes mode)
  const effectiveUserType = $derived(() => {
    const urlParams = parseUrlParameters();
    
    // If in mentor view mode, override user type to mentor
    if (urlParams.menteeId && urlParams.viewMode === 'mentor') {
      console.log('[Mentor View] Setting user type to mentor');
      return 'mentor';
    }
    
    // Otherwise use provided or fallback user type
    return userType || usertype || userTypeAttr || userRole || userRoleAttr || config?.userRole || 'mentee';
  });
</script>

<svelte:options customElement="teacher-induction-log-app" />

<main>
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p style="color: red; text-align: center; padding: 1rem;">
      Error loading configuration. Displaying default/fallback data. Some options may be limited.
    </p>
    {#if isAdminView()}
      <AdminPanel />
    {:else}
      <InductionLog userType={effectiveUserType()} />
    {/if}
  {:else if config}
    {#if isAdminView()}
      <AdminPanel />
    {:else}
      <InductionLog userType={effectiveUserType()} />
    {/if}
  {:else}
    <p>Cannot display application.</p>
  {/if}
</main>

<style>
  main {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
    /* Add display: block or flex if needed, depending on how custom element host behaves */
    display: block; 
  }
  /* Add styles for loading/error paragraphs if desired */
  p {
    padding: 2rem;
    text-align: center;
    font-style: italic;
    color: #555;
  }
</style>