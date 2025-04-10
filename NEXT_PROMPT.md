# Teacher Induction Log Project Guide

## Project Overview
The Teacher Induction Log is a Svelte 5 web application designed to track teacher induction programs. It provides a structured approach to documenting a new teacher's professional development journey during their first two years, including various activities, meetings, and professional development sessions.

## Project Details
- **Project Location**: /Users/kempb/Projects/teacher-induction-log
- **Framework**: Svelte 5
- **Language**: TypeScript
- **Architecture**: Web Components with Shadow DOM
- **Package Manager**: pnpm (located at /Users/kempb/Library/pnpm/pnpm)
- **Build Tool**: Vite
- **Testing**: Vitest with Testing Library (current coverage: ~68.18%)

## Project Structure
- **src/lib**: Core components and stores
  - **components/sections**: Form section components (CoverPage, Signatures, etc.)
  - **components/ui**: Reusable UI components (Button, DateInput, ActivityTable, etc.)
  - **config**: Configuration files including section configs
  - **stores**: State management (formStore.ts, saveManager.ts)
- **src/tests**: Test files
- **src/custom-element.ts**: Web Component definition
- **src/lib-components.ts**: Auto-registration of components

## Current Status
As of April 4, 2025, the following tasks have been completed:
- Improved form header layout to reduce blank space on left and right sides
- Fixed ActivityTable component to properly display actions column
- Fixed custom-element.ts to properly handle attribute updates
- Refactored formStore.ts to improve type safety
- Fixed row-level security to ensure verification fields are read-only while other row fields remain editable
- Fixed lib-components.ts by adding comprehensive tests

## Remaining High-Priority Tasks
1. Continue improving test coverage (current: 68.18%, target: 80%)
2. Add comprehensive integration tests for row-level security implementation
3. Add validation for special fields (email, phone numbers, etc.)

## Git Workflow

### Before Starting Any Task
1. Check git status: `git status`
2. Pull latest changes: `git pull origin main`
3. Create a feature branch for larger tasks: `git checkout -b feature/task-name`

### During Development
1. Make atomic, focused commits for logical units of work
2. Use descriptive commit messages with a short summary first line followed by details
3. Check changes before committing: `git diff file-name`

### After Completing a Task
1. Verify all tests pass: `/Users/kempb/Library/pnpm/pnpm run test`
2. Update TASKS.md to mark the task as completed
3. Commit your changes with a descriptive message
4. If you created a feature branch, merge it back to main:
   ```
   git checkout main
   git merge feature/task-name
   ```
5. Keep the commit history clean by using atomic, focused commits

## Common Git Commands
- `git add .` - Stage all changes
- `git add <file>` - Stage specific file
- `git commit -m "Message"` - Commit staged changes
- `git checkout -- <file>` - Discard changes to specific file
- `git diff` - View uncommitted changes
- `git log --oneline -n 5` - View recent commit history

## Development Instructions

### Setting Up
1. Source environment variables: `source /Users/kempb/Projects/Claude/.clauderc`
2. Navigate to project directory: `cd /Users/kempb/Projects/teacher-induction-log`
3. Install dependencies if needed: `/Users/kempb/Library/pnpm/pnpm install`

### Running Tests
- Run tests: `/Users/kempb/Library/pnpm/pnpm run test`
- Run coverage tests: `/Users/kempb/Library/pnpm/pnpm run test:coverage`
- View coverage report: Open `/Users/kempb/Projects/teacher-induction-log/coverage/index.html`

### Development Server
- Start dev server: `/Users/kempb/Library/pnpm/pnpm run dev`
- Access the app: Open http://localhost:5173 in your browser

## Instructions for Next Session

For our next session, please focus on implementing validation for special fields (email, phone numbers, etc.). This is one of our remaining high-priority tasks.

### Validation Implementation Tasks:
1. Add validation utilities to src/lib/utils.ts for email, phone numbers, and other special fields
2. Integrate validation with form components that accept these special fields
3. Add appropriate error messaging for validation failures
4. Ensure validation works properly with the form store

Before starting:
1. Create a new feature branch: `git checkout -b feature/field-validation`
2. Examine existing validation (if any) in the codebase
3. Look at input field components to understand how to integrate validation
4. Check if there are any existing tests for validation

Implementation strategy should include:
1. Creating reusable validation functions
2. Adding validation to relevant components
3. Creating tests for the validation functions
4. Creating tests for component behavior when validation fails
5. Implementing user feedback for validation failures

When implementing the validation:
1. Make small, incremental changes
2. Run tests frequently
3. Keep validation logic centralized where possible for maintainability
4. Update documentation/comments to explain validation rules

If you're unsure about any aspect of the project or validation requirements, please check the relevant files or ask for clarification before proceeding with implementation.


Let's begin! Our next task is to change the "Teacher Mentor" field into a dropdown that gets populated by the config JSON object. What's the best way to proceed?