<script lang="ts">
  import { onMount } from 'svelte';
  import InductionLog from './lib/InductionLog.svelte';
  // Ensure this type import points to the updated FormConfig interface
  import type { FormConfig } from './lib/stores/formStore'; 
  import { setFormConfig } from './lib/stores/formStore';
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
    const queryString = window.location.search;
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
    
    // Add query string if not in mentor view mode
    if (!urlParams.menteeId && queryString) {
      configUrl += queryString;
    }
    
    console.log('Config URL:', configUrl);
    return configUrl;
  }
  
  // Load the configuration
  async function loadConfig() {
    loading = true; // Ensure loading is true at start
    error = false;
    let loadedConfig: FormConfig; 

    try {
      console.log('Fetching configuration from:', getConfigUrl());
      const response = await fetch(getConfigUrl());
      
      if (!response.ok) {
        throw new Error(`Failed to fetch configuration: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      // Assume fetched data structure matches FormConfig (data, userRole, options, editable)
      // Add runtime validation here if needed for extra safety
      loadedConfig = data as FormConfig; 
      
      console.log('Successfully loaded configuration:', loadedConfig);
      
      // Update the form store with the loaded configuration
      setFormConfig(loadedConfig); // Pass the full config object
      config = loadedConfig; // Update local state for conditional rendering

    } catch (err) {
      console.error('Error loading configuration:', err);
      error = true;
      
      // --- UPDATED Fallback Configuration ---
      // Create a complete hardcoded configuration matching FormConfig interface
      loadedConfig = { 
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
      setFormConfig(loadedConfig); 
      config = loadedConfig; // Update local state for conditional rendering
      
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
    <p>Loading Induction Log...</p>
  {:else if error}
     <p style="color: red; text-align: center; padding: 1rem;">
      Error loading configuration. Displaying default/fallback data. Some options may be limited.
    </p>
    <InductionLog userType={effectiveUserType()} /> 
  {:else if config}
    <InductionLog userType={effectiveUserType()} /> 
  {:else}
     <p>Cannot display Induction Log.</p>
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