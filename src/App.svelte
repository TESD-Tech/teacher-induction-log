<script lang="ts">
  import { onMount } from 'svelte';
  import InductionLog from './lib/InductionLog.svelte';
  import type { FormConfig } from './lib/stores/formStore';
  import { setFormConfig } from './lib/stores/formStore';
  import './assets/global.css';
  import './assets/print.css';
  
  // State variables
  let config: FormConfig; // Keep local config state if needed for the loading logic
  let loading = true;
  let error = false;
  
  // Determine the correct JSON endpoint based on the current URL
  function getConfigUrl(): string {
    // Check if we're in a PowerSchool environment
    const pathname = window.location.pathname;
    const baseUrl = window.location.origin;
    const queryString = window.location.search; // Get the query string including the '?'
    
    let configUrl = '';
    
    if (pathname.includes('/admin/')) {
      configUrl = `${baseUrl}/admin/teacher-induction-log/log.json`;
    } else if (pathname.includes('/teachers/')) {
      configUrl = `${baseUrl}/teachers/teacher-induction-log/log.json`;
    } else {
      // Development environment
      configUrl = '/log.json';
    }
    
    // Append the query string if it exists
    if (queryString) {
      configUrl += queryString;
    }
    
    console.log('Config URL with query parameters:', configUrl);
    return configUrl;
  }
  
  // Load the configuration directly from the JSON file
  async function loadConfig() {
    let loadedConfig: FormConfig; // Use a temporary variable
    try {
      console.log('Fetching configuration from:', getConfigUrl());
      const response = await fetch(getConfigUrl());
      
      if (!response.ok) {
        throw new Error(`Failed to fetch configuration: ${response.status}`);
      }
      
      const data = await response.json();
      loadedConfig = data as FormConfig; // Assign to temporary variable
      
      console.log('Successfully loaded configuration:', loadedConfig);
      
      // Update the form store with the loaded configuration
      setFormConfig(loadedConfig); // Set the store HERE
      config = loadedConfig; // Update local state AFTER setting store if needed for #if block
      
    } catch (err) {
      console.error('Error loading configuration:', err);
      error = true;
      
      // Create a hardcoded configuration as fallback
      loadedConfig = { // Assign to temporary variable
        userRole: 'mentee',
        data: {
          inductee: "Tester, Esther!!!!",
          building: "HARDCODED SCHOOL",
          // ... rest of fallback data
          assignment: "Mathematics",
          mentorTeacher: "Robert Johnson",
          mentorNames: [
            "Robert Johnson",
            "Ada Lovelace",
            "Patti Smith",
          ],
          schoolYearOne: "2024-2025",
          schoolYearTwo: "2025-2026",
          summerAcademy: [
            { day: "Day 1", dateYearOne: "2024-08-15", dateYearTwo: "", verification: "BJK" },
            { day: "Day 2", dateYearOne: "2024-08-16", dateYearTwo: "", verification: "BJK" },
            { day: "Day 3", dateYearOne: "2024-08-17", dateYearTwo: "", verification: "" },
            { day: "Day 4", dateYearOne: "2024-08-18", dateYearTwo: "", verification: "" }
          ],
          inductionSeminars: [
            { number: 1, topic: "Classroom Management", dateYearOne: "2024-09-10", dateYearTwo: "", verification: "BJK" },
            { number: 2, topic: "Differentiated Instruction", dateYearOne: "2024-10-15", dateYearTwo: "", verification: "" },
            { number: 3, topic: "Assessment Strategies", dateYearOne: "", dateYearTwo: "", verification: "" },
            { number: 4, topic: "Technology Integration", dateYearOne: "", dateYearTwo: "", verification: "" }
          ],
          mentorMeetings: [
            { date: "2024-09-05", topic: "First Week Reflection", dateYearOne: "2024-09-05", dateYearTwo: "", verification: "BJK" },
            { date: "2024-10-03", topic: "Parent-Teacher Conferences Prep", dateYearOne: "2024-10-03", dateYearTwo: "", verification: "BJK" }
          ],
          teamMeetings: [
            { date: "2024-09-12", topic: "Math Department Planning", dateYearOne: "2024-09-12", dateYearTwo: "", verification: "BJK" }
          ],
          classroomVisits: [
            { date: "2024-09-20", teacher: "Sarah Williams", subject: "Algebra II", dateYearOne: "2024-09-20", dateYearTwo: "", verification: "BJK" }
          ],
          otherActivities: [
            { date: "2024-09-25", activity: "Math Club Supervision", dateYearOne: "2024-09-25", dateYearTwo: "", verification: "BJK" }
          ],
          signatures: {
            mentorTeacher: "",
            buildingPrincipal: "",
            superintendent: "",
            date: ""
          }
        }
      };
      
      // Update the form store with the fallback configuration
      setFormConfig(loadedConfig); // Set the store HERE
      config = loadedConfig; // Update local state AFTER setting store if needed for #if block
      
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    // Load the configuration directly from the JSON file
    loadConfig();
  });
</script>
<svelte:options customElement="teacher-induction-log-app" />
<main>
  {#if !loading && config} <InductionLog /> {:else if loading}
    <p>Loading...</p>
  {:else if error}
    <p>Error loading configuration. Displaying fallback data.</p>
     <InductionLog /> 
  {/if}
</main>

<style>
  main {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }
</style>