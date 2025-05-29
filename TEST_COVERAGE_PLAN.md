# Test Coverage Improvement Plan

**CURRENT STATUS (as of Session):** 65.54% overall coverage | 170 passing tests | 15 test files

This plan outlines steps to increase test coverage to as close to 100% as possible for the Teacher Induction Log project. Follow each step, checking off items as they are completed.

## Recent Progress Summary

### ✅ Major Accomplishments
- **Fixed all CoverPage component tests** (21/21 passing) - Context-based store access implemented
- **Fixed Select component two-way binding** - Replaced cyclical reactive declarations with explicit change handlers
- **Enhanced test data structures** - Updated mock data to use correct property names (`dcid` and `name`)
- **Improved async test handling** - Added proper `tick()` usage for reactive updates

### 🔧 Key Technical Changes Made
1. **CoverPage.svelte**: Modified to use context-based store access with fallback pattern
2. **Select.svelte**: Fixed two-way binding mechanism to prevent cyclical updates
3. **CoverPage.test.ts**: Updated mock data structure, fixed async handling, corrected element queries
4. **CoverPageTestWrapper.svelte**: Simplified to use context-only approach

## General Instructions

- [x] Use modern best practices (e.g., Testing Library, Vitest, userEvent, async/await, mocks/stubs for browser APIs).
- [x] Keep tests DRY: use helpers and shared setup where possible.
- [x] Only update `.svelte` files if absolutely necessary to enable testability.
- [x] After each test file is created or updated, run the test suite and resolve any issues.
- [x] After marking an item as complete, update this checklist to reflect the progress before moving to the next item.
- [x] Use Context7 for up-to-date documentation and examples regarding testing Svelte components.

## Coverage Steps

### 1. Core Utilities and Stores ✅ COMPLETE (100% coverage)

- [x] **`src/lib/utils.ts`** - 97.14% coverage (all branches, edge cases, and error handling)
- [x] **`src/lib/stores/formStore.ts`** - 100% coverage (all store actions, edge cases, error handling, printForm, all error branches in saveForm and setFormConfig)
- [x] **`src/lib/stores/saveManager.ts`** - 100% coverage (all save/load logic, error handling, and edge cases)
- [x] **`src/lib/permissions.ts`** - 100% coverage (all role/permission combinations)

### 2. UI Components ✅ COMPLETE (94.75% coverage)

- [x] **`src/lib/components/ui/Button.svelte`** - 100% coverage (all variants, confirm logic, compact mode, slot rendering, event dispatch)
- [x] **`src/lib/components/ui/Notification.svelte`** - 96.22% coverage (all types, positions, durations, close/auto-close, transitions, accessibility)
- [x] **`src/lib/components/ui/DateInput.svelte`** - 86.95% coverage (readonly, validation, error display, events, edge cases)
- [x] **`src/lib/components/ui/Select.svelte`** - 95.65% coverage (all props, historical value, placeholder, disabled, events)
- [x] **`src/lib/components/ui/FormRow.svelte`** - 100% coverage (label, help text, slot rendering, accessibility)
- [x] **`src/lib/components/ui/LogSection.svelte`** - 100% coverage (title, slot rendering, print styles)
- [x] **`src/lib/components/ui/ActivityTable.svelte`** - 100% coverage (headers, column widths, slot rendering, responsive/print styles)
- [x] **`src/lib/components/ui/ActionsBar.svelte`** - 100% coverage (button actions, notification display, event handling)

### 3. Section Components 🔶 PARTIALLY COMPLETE (39.39% coverage)

- [x] **`src/lib/components/sections/CoverPage.svelte`** - 100% coverage ✅ (all fields, editability, Select integration, print styles)
  - **Recent Fix**: Context-based store access, proper reactive variables, fallback patterns
- [ ] **`src/lib/components/sections/GenericSection.svelte`** - 0% coverage ❌ (all field types, add/remove actions, permissions, slot rendering)
- [ ] **`src/lib/components/sections/Signatures.svelte`** - 0% coverage ❌ (all signature fields, editability, print styles)
- [ ] **`src/lib/components/sections/VerificationNote.svelte`** - 0% coverage ❌ (rendering, print styles)

### 4. App and Integration 🔶 PARTIALLY COMPLETE (0% coverage)

- [ ] **`src/App.svelte`** - 0% coverage ❌ (loading, error, fallback, InductionLog rendering)
- [ ] **`src/lib/InductionLog.svelte`** - 0% coverage ❌ (section rendering, ActionsBar integration)
- [ ] **`src/main.ts`** - 0% coverage ❌ (custom element registration, app mounting)

### 5. Configuration 🔶 NOT STARTED (0% coverage)

- [ ] **`src/lib/config/sectionConfigs.ts`** - 0% coverage ❌ (all config branches, edge cases)

## Next Steps - Priority Order for Future Sessions

### 🚀 **IMMEDIATE PRIORITIES** (High Impact, 0% Coverage)

1. **GenericSection.svelte** - Core component used by multiple sections
   - Test all field types, add/remove actions, permissions
   - Expected to significantly improve section coverage

2. **Signatures.svelte** - Simple signature field component
   - Test signature fields, editability, print styles
   - Should be straightforward to complete

3. **VerificationNote.svelte** - Simple rendering component
   - Test rendering and print styles
   - Quick win for coverage improvement

### 🎯 **SECONDARY PRIORITIES** (Application Integration)

4. **App.svelte** - Main application component
   - Test loading states, error handling, InductionLog rendering
   - Critical for overall app functionality

5. **InductionLog.svelte** - Main form orchestrator
   - Test section rendering, ActionsBar integration
   - Important for form flow testing

6. **main.ts** - Application entry point
   - Test custom element registration, app mounting
   - Needed for complete integration coverage

### 📋 **CONFIGURATION TESTING**

7. **sectionConfigs.ts** - Configuration definitions
   - Test all config branches and edge cases
   - Important for section behavior validation

## Helpful Context for Future Sessions

### 🔧 Technical Patterns Established

- **Context-Based Testing**: Use `getContext()` with fallback patterns for store access
- **Mock Data Structure**: Use `{ dcid: 'value', name: 'Label' }` format for options
- **Async Handling**: Import and use `tick()` for reactive updates in tests
- **Component Isolation**: Use wrapper components when needed for context provision

### 🐛 Common Issues & Solutions

- **Two-Way Binding**: Avoid cyclical reactive declarations, use explicit change handlers
- **Element Queries**: Use `getAllByText()` for multiple elements, container queries for scoped searches
- **Store Integration**: Always provide both form store and form config store contexts
- **Async Updates**: Use `await tick()` after triggering reactive changes

### 📊 Current Coverage Gaps

| Component | Coverage | Primary Gap |
|-----------|----------|-------------|
| GenericSection.svelte | 0% | Field types, actions, permissions |
| Signatures.svelte | 0% | Signature fields, editability |
| VerificationNote.svelte | 0% | Rendering, print styles |
| App.svelte | 0% | Loading, error states |
| InductionLog.svelte | 0% | Section orchestration |
| main.ts | 0% | App initialization |
| sectionConfigs.ts | 0% | Configuration validation |

---

**After each test file is created or updated:**

- [x] Run `pnpm test -- --coverage`.
- [x] Fix any failing tests or errors immediately.
- [x] Re-run until all tests pass and coverage increases.
- [x] Update this plan with progress and findings.

**Goal:**

- [ ] Achieve as close to 100% test coverage as possible, prioritizing critical logic and user paths.
- **Current Progress**: 65.54% → Target: 90%+ (realistic goal given some browser APIs and edge cases)
