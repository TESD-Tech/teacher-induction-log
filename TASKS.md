# Teacher Induction Log - Tasks

### Next Major Refactor
- Updated `GenericSection.svelte` to use centralized `canEdit()` function for all field permissions

- Replace nested editability booleans and duplicated role logic with a single centralized `canEdit(role, sectionId, fieldKey)` function
- Use this function throughout the UI to determine field editability
- Remove `editable` and `verifications` nested objects
- Simplify `GenericSection.svelte` and other components to call `canEdit()` directly
- Make permissions composable and override-friendly
- Add tests for `canEdit()` covering all roles, sections, and fields
- Document permission rules clearly in one place

## Current Tasks

### High Priority
- [ ] Improve test coverage (current coverage: ~80.5% of statements, target: 90%)

### Medium Priority
- [ ] Improve accessibility features across all components
- [ ] Enhance error handling and user feedback messages
- [ ] Optimize bundle size to improve loading performance
- [ ] Document component API for better maintainability
- [ ] Update form styling to match latest design guidelines
- [ ] Fix date picker display issues in Firefox browsers
- [ ] Resolve shadow DOM styling conflicts with certain components

### Low Priority
- [ ] Add dark mode support
- [ ] Implement keyboard shortcuts for common actions
- [ ] Create animated transitions between form sections
- [ ] Add support for file attachments (certificates, etc.)
- [ ] Implement data export to CSV/Excel format
- [ ] Address form submission failures on slow network connections
- [ ] Fix printing layout issues with tables spanning multiple pages
- [ ] Create user guide for teachers and administrators

## Technical Debt
- [ ] Separate UI logic from data management in components
- [ ] Standardize event handling across components
- [ ] Create proper error boundaries for component failures

## Test Coverage Summary (April 7, 2025)

**Overall Coverage:**
- Statements: ~80.5%
- Branches: ~86.81%
- Functions: ~80.35%
- Lines: ~80.5%

**Well-Covered Areas:**
- `src/App.svelte`
- `src/lib/stores/formStore.ts`
- `src/lib/stores/saveManager.ts` (100% coverage)
- `src/lib/utils.ts` (100% coverage)
- `src/lib/config/sectionConfigs.ts`
- `src/lib/components/sections/VerificationNote.svelte` (100% coverage)
- `src/lib/components/ui/ActionsBar.svelte` (~94.5% coverage)
**Areas with Low or No Coverage:**
- `src/main.ts` (0% coverage)
- `src/lib-components.ts` (75% coverage)
**Notes & TODOs:**
- Focus on improving coverage for `src/main.ts` and other bootstrap files
- ✅ Add tests for VerificationNote component functionality 
- The overall coverage is currently ~80.5%, new target is 90%

## Future Enhancements
- [ ] Add support for multiple language localization
- [ ] Implement role-based conditional form fields
- [ ] Create advanced filtering and search functionality
- [ ] Integrate with notification system for approval workflows
- [ ] Develop analytics dashboard for program administrators
- [ ] Add support for attachment uploads
- [ ] Create administrator dashboard for monitoring multiple inductees
- [ ] Implement data export capabilities (PDF, Excel)

## Documentation Tasks
- [ ] Create user guide for teachers and administrators
- [ ] Add inline code documentation for complex functions
- [ ] Document testing strategy and coverage goals
- [ ] Create component API documentation
- [ ] Document PowerSchool integration process

*Last updated: April 7, 2025*
