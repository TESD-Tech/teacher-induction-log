<script lang="ts">
  import type { ParsedLogEntry } from '../../stores/appStore';
  import Button from '../ui/Button.svelte';

  interface Props {
    log: ParsedLogEntry;
    isOpen: boolean;
    onClose: () => void;
  }

  let { log, isOpen, onClose }: Props = $props();

  // Format date for display
  function formatDate(date: string | Date): string {
    if (!date) return 'Not specified';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Format time for display
  function formatTime(timeString: string): string {
    if (!timeString) return 'Not specified';
    return timeString;
  }

  // Close modal when clicking outside
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  // Close modal on Escape key
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onClose();
    }
  }
</script>

{#if isOpen}
  <div 
    class="modal-backdrop" 
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
    style="z-index: 10000;"
  >
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modal-title">Log Details</h2>
        <button 
          class="close-button" 
          onclick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>

      <div class="modal-body">
        <div class="log-info-grid">
          <div class="info-section">
            <h3>Teacher Information</h3>
            <div class="info-item">
              <span class="info-label">Name:</span>
              <span>{log.data.inductee}</span>
            </div>
            <div class="info-item">
              <span class="info-label">School:</span>
              <span>{log.data.building}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Subject:</span>
              <span>{log.data.assignment}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Mentor:</span>
              <span>{log.data.mentorTeacher}</span>
            </div>
          </div>

          <div class="info-section">
            <h3>Log Details</h3>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="status-badge status-{log.completionStatus.toLowerCase()}">
                {log.completionStatus}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">School Year One:</span>
              <span>{log.data.schoolYearOne}</span>
            </div>
            <div class="info-item">
              <span class="info-label">School Year Two:</span>
              <span>{log.data.schoolYearTwo}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Last Modified:</span>
              <span>{formatDate(log.lastModified)}</span>
            </div>
          </div>
        </div>

        {#if log.data.mentorMeetings && log.data.mentorMeetings.length > 0}
          <div class="activities-section">
            <h3>Mentor Meetings</h3>
            <div class="activities-list">
              {#each log.data.mentorMeetings as meeting}
                <div class="activity-item">
                  <div class="activity-header">
                    <span class="activity-type">Meeting</span>
                    <span class="activity-date">{meeting.date || meeting.dateYearOne}</span>
                  </div>
                  {#if meeting.topic}
                    <p class="activity-description">{meeting.topic}</p>
                  {/if}
                  {#if meeting.verification}
                    <div class="verification-badge">✓ {meeting.verification}</div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        {#if log.data.classroomVisits && log.data.classroomVisits.length > 0}
          <div class="activities-section">
            <h3>Classroom Visits</h3>
            <div class="activities-list">
              {#each log.data.classroomVisits as visit}
                <div class="activity-item">
                  <div class="activity-header">
                    <span class="activity-type">Visit</span>
                    <span class="activity-date">{visit.date || visit.dateYearOne}</span>
                  </div>
                  {#if visit.teacher || visit.subject}
                    <p class="activity-description">
                      {#if visit.teacher}Teacher: {visit.teacher}{/if}
                      {#if visit.teacher && visit.subject} | {/if}
                      {#if visit.subject}Subject: {visit.subject}{/if}
                    </p>
                  {/if}
                  {#if visit.verification}
                    <div class="verification-badge">✓ {visit.verification}</div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        {#if log.data.signatures && (log.data.signatures.mentorTeacher || log.data.signatures.buildingPrincipal || log.data.signatures.superintendent)}
          <div class="signatures-section">
            <h3>Signatures</h3>
            <div class="signatures-grid">
              {#if log.data.signatures.mentorTeacher}
                <div class="signature-item">
                  <span class="info-label">Mentor Teacher:</span>
                  <span>{log.data.signatures.mentorTeacher}</span>
                </div>
              {/if}
              {#if log.data.signatures.buildingPrincipal}
                <div class="signature-item">
                  <span class="info-label">Building Principal:</span>
                  <span>{log.data.signatures.buildingPrincipal}</span>
                </div>
              {/if}
              {#if log.data.signatures.superintendent}
                <div class="signature-item">
                  <span class="info-label">Superintendent:</span>
                  <span>{log.data.signatures.superintendent}</span>
                </div>
              {/if}
              {#if log.data.signatures.date}
                <div class="signature-item">
                  <span class="info-label">Date:</span>
                  <span>{formatDate(log.data.signatures.date)}</span>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </div>

      <div class="modal-footer">
        <Button variant="default" onclick={onClose}>
          Close
        </Button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    margin: 20px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 24px 0 24px;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 24px;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .close-button:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .modal-body {
    padding: 0 24px;
  }

  .log-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
  }

  .info-section {
    background: #f9fafb;
    border-radius: 8px;
    padding: 16px;
  }

  .info-section h3 {
    margin: 0 0 16px 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 8px;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 8px 0;
  }

  .info-item:last-child {
    margin-bottom: 0;
  }

  .info-item span.info-label {
    font-weight: 500;
    color: #6b7280;
    min-width: 120px;
  }

  .info-item span {
    color: #1f2937;
    font-weight: 400;
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  .status-complete {
    background: #dcfce7;
    color: #166534;
  }

  .status-pending {
    background: #fef3c7;
    color: #92400e;
  }

  .status-incomplete {
    background: #fee2e2;
    color: #991b1b;
  }

  .activities-section,
  .signatures-section {
    margin-top: 24px;
  }

  .activities-section h3,
  .signatures-section h3 {
    margin: 0 0 16px 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 8px;
  }

  .activities-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .activity-item {
    background: #f9fafb;
    border-radius: 8px;
    padding: 16px;
    border-left: 4px solid #fbca28;
  }

  .activity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .activity-type {
    font-weight: 600;
    color: #1f2937;
    background: #fbca28;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .activity-date {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .activity-description {
    margin: 0;
    color: #4b5563;
    line-height: 1.5;
  }

  .signatures-section {
    background: #f9fafb;
    border-radius: 8px;
    padding: 16px;
  }

  .signatures-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .signature-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
  }

  .verification-badge {
    margin-top: 8px;
    padding: 4px 8px;
    background: #dcfce7;
    color: #166534;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    display: inline-block;
  }

  .modal-footer {
    padding: 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .modal-content {
      width: 95%;
      margin: 10px;
      max-height: 95vh;
    }

    .log-info-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .signatures-grid {
      grid-template-columns: 1fr;
    }

    .info-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .info-item span.info-label {
      min-width: auto;
    }

    .activity-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
</style>