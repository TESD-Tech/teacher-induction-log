# Test Coverage Plan

This checklist will help us systematically improve and track test coverage for the project. Each item should be checked off as coverage is added and verified.

**Important Coverage Metrics:**

- **Statements (stmts):** Percentage of executable lines covered by tests. Aim for high coverage to ensure most code is exercised.
- **Branches:** Percentage of conditional branches (if/else, switch, ternary, etc.) covered. High branch coverage ensures all logic paths are tested, not just the main flow.
- **Functions:** Percentage of functions/methods covered by tests.
- **Lines:** Percentage of code lines covered (often similar to stmts).

> For critical files/components, aim for 100% in all columns. If not possible, document why any uncovered lines/branches are acceptable.

## UI Components (src/lib/components/ui)

- [x] Button.svelte: 100% statements, 100% functions, 100% lines, 100% branches
- [ ] DateInput.svelte: 86.95% statements, 100% functions, 86.95% lines, 90.69% branches (add tests for uncovered lines/branches)
- [x] FormRow.svelte: 100% statements, 100% functions, 100% lines, 100% user-facing branches (Svelte-internal label fallback branch is not user-testable)
- [x] LogSection.svelte: 100% statements, 100% functions, 100% lines, 100% branches
- [x] Select.svelte: 100% statements, 100% functions, 100% lines, 100% user-facing branches (Svelte-internal option/slot branches are not user-testable)
- [ ] Notification.svelte: Add tests, reach 100% coverage
- [ ] ActionsBar.svelte: Add tests, reach 100% coverage
- [ ] ActivityTable.svelte: Add tests, reach 100% coverage

> **Note:** Some Svelte-internal slot fallback or label branches may remain uncovered in coverage tools, but all user-facing logic is fully tested.

## Section Components (src/lib/components/sections)

- [ ] CoverPage.svelte: Add tests, reach 100% coverage
- [ ] CoverPageTestWrapper.svelte: Add tests, reach 100% coverage
- [ ] GenericSection.svelte: Add tests, reach 100% coverage
- [ ] Signatures.svelte: Add tests, reach 100% coverage
- [ ] VerificationNote.svelte: Add tests, reach 100% coverage

## Stores (src/lib/stores)

- [ ] formStore.ts: 100% line/branch/function coverage
- [ ] saveManager.ts: Add tests, reach 100% coverage

## Utilities & Config

- [ ] utils.ts: Add tests, reach 100% coverage
- [ ] permissions.ts: Add tests, reach 100% coverage
- [ ] config/sectionConfigs.ts: Add tests, reach 100% coverage

## App Entrypoints

- [ ] App.svelte: Add tests, reach 100% coverage
- [ ] main.ts: Add tests, reach 100% coverage

## General

- [ ] Ensure all uncovered lines/branches in coverage report are addressed
- [ ] Add tests for edge cases and error handling
- [ ] Review and update this checklist as new files/components are added

---
*Update this file as you add coverage or discover new areas needing tests.*
