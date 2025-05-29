# Test Coverage Improvement Plan

This plan outlines steps to increase test coverage to as close to 100% as possible for the Teacher Induction Log project. Follow each step, checking off items as they are completed. After creating or updating a test file, run the test suite and resolve any issues before proceeding.

## General Instructions

- [ ] Use modern best practices (e.g., Testing Library, Vitest, userEvent, async/await, mocks/stubs for browser APIs).
- [ ] Keep tests DRY: use helpers and shared setup where possible.
- [ ] Only update `.svelte` files if absolutely necessary to enable testability.
- [ ] After each test file is created or updated, run the test suite and resolve any issues.
- [ ] After marking an item as complete, update this checklist to reflect the progress before moving to the next item.

## Coverage Steps

### 1. Core Utilities and Stores

- [x] Ensure 100% coverage for `src/lib/utils.ts` (all branches, edge cases, and error handling).
- [x] Ensure 100% coverage for `src/lib/stores/formStore.ts` (all store actions, edge cases, and error handling, printForm, all error branches in saveForm and setFormConfig).
- [x] Ensure 100% coverage for `src/lib/stores/saveManager.ts` (all save/load logic, error handling, and edge cases).
- [x] Ensure 100% coverage for `src/lib/permissions.ts` (all role/permission combinations).

### 2. UI Components

- [x] Ensure 100% coverage for `src/lib/components/ui/Button.svelte` (all variants, confirm logic, compact mode, slot rendering, event dispatch).
- [ ] Ensure 100% coverage for `src/lib/components/ui/Notification.svelte` (all types, positions, durations, close/auto-close, transitions, accessibility).
- [x] Ensure 100% coverage for `src/lib/components/ui/DateInput.svelte` (readonly, validation, error display, events, edge cases).
- [x] Ensure 100% coverage for `src/lib/components/ui/Select.svelte` (all props, historical value, placeholder, disabled, events).
- [x] Ensure 100% coverage for `src/lib/components/ui/FormRow.svelte` (label, help text, slot rendering, accessibility).
- [x] Ensure 100% coverage for `src/lib/components/ui/LogSection.svelte` (title, slot rendering, print styles).
- [x] Ensure 100% coverage for `src/lib/components/ui/ActivityTable.svelte` (headers, column widths, slot rendering, responsive/print styles).
- [x] Ensure 100% coverage for `src/lib/components/ui/ActionsBar.svelte` (button actions, notification display, event handling).

### 3. Section Components

- [ ] Ensure 100% coverage for `src/lib/components/sections/CoverPage.svelte` (all fields, editability, Select integration, print styles).
- [ ] Ensure 100% coverage for `src/lib/components/sections/GenericSection.svelte` (all field types, add/remove actions, permissions, slot rendering).
- [ ] Ensure 100% coverage for `src/lib/components/sections/Signatures.svelte` (all signature fields, editability, print styles).
- [ ] Ensure 100% coverage for `src/lib/components/sections/VerificationNote.svelte` (rendering, print styles).

### 4. App and Integration

- [ ] Ensure 100% coverage for `src/App.svelte` (loading, error, fallback, InductionLog rendering).
- [ ] Ensure 100% coverage for `src/lib/InductionLog.svelte` (section rendering, ActionsBar integration).
- [ ] Ensure 100% coverage for `src/main.ts` (custom element registration, app mounting).

### 5. Configuration

- [ ] Ensure 100% coverage for `src/lib/config/sectionConfigs.ts` (all config branches, edge cases).

### 6. Miscellaneous

- [ ] Ensure 100% coverage for any helper files, context providers, or additional logic not covered above.

---

**After each test file is created or updated:**

- [ ] Run `pnpm test -- --coverage`.
- [ ] Fix any failing tests or errors immediately.
- [ ] Re-run until all tests pass and coverage increases.

**Goal:**

- [ ] Achieve as close to 100% test coverage as possible, prioritizing critical logic and user paths.
