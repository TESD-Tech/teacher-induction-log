# Teacher Induction Log - Onboarding Guide

## Introduction
Welcome to the Teacher Induction Log project! This guide will help you understand the project structure, development workflow, testing, and contribution process. It is based on the technical notes in `CLAUDE.md` and expanded with comprehensive onboarding information.

---

## Project Overview
The Teacher Induction Log is a **Svelte 5** application built with **TypeScript**. It uses **Web Components** with **Shadow DOM** for encapsulated, reusable UI components. The app tracks teacher induction activities, supports role-based permissions, and integrates with PowerSchool.

---

## Folder Structure

```
/ (project root)
├── README.md             # Project overview and basic setup
├── TASKS.md              # Task list and backlog
├── PLANNING.md           # Design notes and roadmap
├── CLAUDE.md             # Technical implementation notes
├── ROO.md                # This onboarding guide
├── package.json          # Project metadata and scripts
├── pnpm-lock.yaml        # pnpm lockfile
├── vite.config.ts        # Vite build configuration
├── vitest.config.ts      # Vitest testing configuration
├── tsconfig*.json        # TypeScript configurations
├── coverage/             # Test coverage reports
├── plugin_archive/       # Archived plugin builds
├── schema/
│   └── plugin.xml        # Plugin schema/configuration
├── public/               # Static assets
│   └── log.json, vite.svg
└── src/                  # Source code
    ├── main.ts           # App entry point
    ├── custom-element.ts # Defines main web component
    ├── lib-components.ts # Auto-registers components
    ├── assets/           # CSS and images
    ├── lib/              # Core components, stores, configs
    │   ├── components/   # UI and form components
    │   ├── stores/       # Svelte stores for state management
    │   ├── config/       # Section configs
    ├── tests/            # Test files
    └── powerschool/      # PowerSchool integration files
```

---

## Key Components & Architecture

- **Custom Elements:** Built with Svelte, exported as Web Components.
- **Shadow DOM:** Style encapsulation for components.
- **State Management:** Centralized via Svelte writable stores.
- **Role-Based Permissions:** Admin, Mentor, Mentee with different access.
- **PowerSchool Integration:** Embedded via specific directory structure and JSON configs.
- **Styling:** CSS variables, responsive design, print styles.
- **Testing:** Uses Vitest and Testing Library.

---

## Using `pnpm`

This project uses [`pnpm`](https://pnpm.io/) for fast, disk-efficient package management.

### Common Commands

- **Install dependencies**
  ```
  pnpm install
  ```

- **Start development server**
  ```
  pnpm dev
  ```

- **Build for production**
  ```
  pnpm build
  ```

- **Preview production build**
  ```
  pnpm preview
  ```

- **Type check**
  ```
  pnpm check
  ```

- **Run tests once**
  ```
  pnpm test
  ```

- **Run tests in watch mode**
  ```
  pnpm test:watch
  ```

- **Run tests with coverage**
  ```
  pnpm test:coverage
  ```

---

## Markdown Files

- **`README.md`**  
  Basic project overview, setup instructions, and quick start guide.

- **`TASKS.md`**  
  List of current tasks, backlog items, and TODOs.

- **`PLANNING.md`**  
  Design discussions, feature planning, and roadmap notes.

- **`CLAUDE.md`**  
  Technical implementation details, architecture, and development notes.

- **`ROO.md`**  
  This comprehensive onboarding guide for new contributors.

---

## Testing & Coverage

- **Framework:** [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/)
- **Coverage Tool:** `@vitest/coverage-v8`
- **Current Coverage:** ~68% (goal: 80%)
- **Test Types:**
  - Unit tests for components and stores
  - Integration tests for role-based permissions and workflows
- **Test Locations:**  
  `src/tests/` and alongside components as `.test.ts` files
- **Run tests:**  
  `pnpm test` or `pnpm test:watch`
- **Generate coverage report:**  
  `pnpm test:coverage` (output in `coverage/` directory)

---

## Contribution Guidelines

- **Use feature branches** for new work.
- **Write clear commit messages.**
- **Add or update tests** for new features or bug fixes.
- **Run `pnpm check`** before pushing to ensure type safety.
- **Aim to improve test coverage** towards the 80% goal.
- **Follow existing code style** and Svelte best practices.
- **Document significant changes** in relevant markdown files.
- **Coordinate via `TASKS.md`** to avoid duplicate work.

---

## Additional Notes from `CLAUDE.md`

### Implementation Highlights

- Web Components with Shadow DOM
- Reactive form with role-based permissions
- Carbon Design System icons
- Auto-registration of components
- Form validation and auto-save
- Print-optimized stylesheets
- Testing framework for Svelte 5

### Data Structure

- Teacher info, Summer Academy, Seminars
- Mentor & Team Meetings, Classroom Visits
- Other Activities, Signatures, Verification

### User Roles

- **Admin:** Full access, approvals, user management
- **Mentor:** View/comment, edit mentor sections
- **Mentee:** Data entry, limited editing

### PowerSchool Integration

- Embedded via specific directory structure
- Configurable via JSON
- Auto-detects environment

### Development Tips

- Components in `lib/` auto-registered
- Import Carbon icons directly
- Centralized form store
- Fix Svelte 5 testing incompatibilities
- Improve type safety in stores

### Next Steps (from CLAUDE.md)

- Improve header layout
- Increase test coverage
- Refactor stores
- Add export, dashboard, attachments, filtering

---

## Getting Started

1. **Clone the repo**
2. **Run `pnpm install`**
3. **Start dev server with `pnpm dev`**
4. **Make changes in `src/`**
5. **Test with `pnpm test`**
6. **Build with `pnpm build`**
7. **Preview with `pnpm preview`**

---

## Summary

This guide provides a comprehensive overview of the Teacher Induction Log project, including architecture, folder structure, development workflow, testing, and contribution guidelines. Refer to the other markdown files for more specific details on tasks, planning, and technical implementation.

Welcome aboard!