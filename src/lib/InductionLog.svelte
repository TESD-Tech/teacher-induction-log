<script lang="ts">
  // Import all section components
  import CoverPage from './components/sections/CoverPage.svelte';
  import SummerAcademy from './components/sections/SummerAcademy.svelte';
  import InductionSeminars from './components/sections/InductionSeminars.svelte';
  import MentorMeetings from './components/sections/MentorMeetings.svelte';
  import TeamMeetings from './components/sections/TeamMeetings.svelte';
  import ClassroomVisits from './components/sections/ClassroomVisits.svelte';
  import OtherActivities from './components/sections/OtherActivities.svelte';
  import Signatures from './components/sections/Signatures.svelte';
  import VerificationNote from './components/sections/VerificationNote.svelte';
  
  // Import UI components
  import ActionsBar from './components/ui/ActionsBar.svelte';
</script>

<div class="induction-log">
  <ActionsBar />
  
  <CoverPage />
  
  <div class="log-content">
    <SummerAcademy />
    <InductionSeminars />
    <MentorMeetings />
    <TeamMeetings />
    <ClassroomVisits />
    <OtherActivities />
    <Signatures />
    <VerificationNote />
  </div>
</div>

<style>
  /* General styles */
  .induction-log {
    font-family: Times New Roman, serif;
    max-width: 8.5in;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    line-height: 1.5;
  }
  
  /* Print-specific styles */
  @media print {
    .induction-log {
      padding: 0;
    }
  }
</style>