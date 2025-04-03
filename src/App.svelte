<script lang="ts">
  import { onMount } from 'svelte';
  import InductionLog from './lib/InductionLog.svelte';
  import type { FormConfig } from './lib/stores/formStore';
  import { setFormConfig } from './lib/stores/formStore';
  import './assets/global.css';
  import './assets/print.css';
  
  // State variables
  let config: FormConfig;
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
    try {
      console.log('Fetching configuration from:', getConfigUrl());
      const response = await fetch(getConfigUrl());
      
      if (!response.ok) {
        throw new Error(`Failed to fetch configuration: ${response.status}`);
      }
      
      const data = await response.json();
      config = data as FormConfig;
      
      console.log('Successfully loaded configuration:', config);
      console.log('Inductee name:', config.data.inductee);
      
      // Update the form store with the loaded configuration
      setFormConfig(config);
    } catch (err) {
      console.error('Error loading configuration:', err);
      error = true;
      
      // Create a hardcoded configuration as fallback
      config = {
        userRole: 'admin',
        editable: {
          inductee: false,
          building: false,
          assignment: false,
          mentorTeacher: true,
          schoolYearOne: false,
          schoolYearTwo: false,
          summerAcademy: true,
          inductionSeminars: true,
          mentorMeetings: true,
          teamMeetings: true,
          classroomVisits: true,
          otherActivities: true,
          signatures: false
        },
        data: {
          inductee: "Tester, Esther!!!!",
          building: "HARDCODED SCHOOL",
          assignment: "Mathematics",
          mentorTeacher: "Robert Johnson",
          schoolYearOne: "2024-2025",
          schoolYearTwo: "2025-2026",
          summerAcademy: [
            { day: "Day 1", dateYearOne: "2024-08-15", dateYearTwo: "", verification: "Completed" },
            { day: "Day 2", dateYearOne: "2024-08-16", dateYearTwo: "", verification: "Completed" },
            { day: "Day 3", dateYearOne: "2024-08-17", dateYearTwo: "", verification: "" },
            { day: "Day 4", dateYearOne: "2024-08-18", dateYearTwo: "", verification: "" }
          ],
          inductionSeminars: [
            { number: 1, topic: "Classroom Management", dateYearOne: "2024-09-10", dateYearTwo: "", verification: "Completed" },
            { number: 2, topic: "Differentiated Instruction", dateYearOne: "2024-10-15", dateYearTwo: "", verification: "" },
            { number: 3, topic: "Assessment Strategies", dateYearOne: "", dateYearTwo: "", verification: "" },
            { number: 4, topic: "Technology Integration", dateYearOne: "", dateYearTwo: "", verification: "" }
          ],
          mentorMeetings: [
            { date: "2024-09-05", topic: "First Week Reflection", dateYearOne: "2024-09-05", dateYearTwo: "", verification: "Completed" },
            { date: "2024-10-03", topic: "Parent-Teacher Conferences Prep", dateYearOne: "2024-10-03", dateYearTwo: "", verification: "Completed" }
          ],
          teamMeetings: [
            { date: "2024-09-12", topic: "Math Department Planning", dateYearOne: "2024-09-12", dateYearTwo: "", verification: "Completed" }
          ],
          classroomVisits: [
            { date: "2024-09-20", teacher: "Sarah Williams", subject: "Algebra II", dateYearOne: "2024-09-20", dateYearTwo: "", verification: "Completed" }
          ],
          otherActivities: [
            { date: "2024-09-25", activity: "Math Club Supervision", dateYearOne: "2024-09-25", dateYearTwo: "", verification: "Completed" }
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
      setFormConfig(config);
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    // Load the configuration directly from the JSON file
    loadConfig();
  });
</script>

<main>
  <InductionLog config={config} />
</main>

<style>
  main {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }
</style>
