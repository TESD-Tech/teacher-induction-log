# Teacher Induction Log

## Overview

This web application is a comprehensive tool for tracking and managing teacher induction programs. It provides a structured approach to documenting a new teacher's professional development journey during their first two years.

## Features

- Track Summer Academy participation
- Record Induction Seminars
- Log Mentor Meetings
- Document Induction Team Meetings
- Record Classroom Visits
- Track Additional Professional Activities
- Flexible Role-Based Access (Teacher and Admin Roles)
- Printable and Saveable Documentation
- Auto-save functionality for form data
- Date validation for consistent formatting
- Responsive design for all device sizes
- Print-optimized stylesheets for PDF generation

## Technology Stack

- Svelte 5
- TypeScript
- Vite
- Web Components with Shadow DOM
- Carbon Icons
- Vitest for Testing

## Architecture & PowerSchool Integration

### Overview

This project is a Svelte 5 application packaged as a **custom element** for embedding within PowerSchool pages.

- The app is embedded via `<teacher-induction-log-app>` inside PowerSchool admin/teacher pages.
- PowerSchool UI chrome is injected using PSHTML tags:

| Tag | Purpose |
|------------------------------|------------------------------|
| `~[wc:commonscripts]`        | Loads common PowerSchool JS |
| `~[wc:admin_header_frame_css]` | Admin header UI             |
| `~[wc:admin_navigation_frame_css]` | Admin navigation UI       |
| `~[wc:admin_footer_frame_css]` | Admin footer UI             |

- **No** `~[tlist_sql]` or `~(gpv.)` tags are used; data is loaded from JSON files.
- The app fetches JSON config from `/admin/teacher-induction-log/log.json` or `/teachers/teacher-induction-log/log.json`.
- The form is **data-driven**, rendering sections dynamically based on the config.

### Svelte App Structure

- `src/main.ts` bootstraps the app, imports:
  - `custom-element.ts` (defines `<teacher-induction-log-app>`)
  - `lib-components.ts` (auto-registers all components as custom elements)
  - `App.svelte` (root component)
- `App.svelte` fetches JSON config and mounts `InductionLog.svelte`.
- `InductionLog.svelte` renders:
  - Cover page
  - Dynamic sections (via `GenericSection.svelte`)
  - Signatures
  - Verification note
- Section configs are defined in `src/lib/config/sectionConfigs.ts`.

### Data Flow

- PowerSchool page loads `<teacher-induction-log-app>`.
- The app fetches JSON config.
- **JSON_CLOB parsing** automatically handles both legacy and new data formats.
- Config is stored in Svelte stores.
- UI components bind to store data.
- User edits update stores.
- **Form submission** uses JSON_CLOB format for PowerSchool database integration.

### JSON_CLOB Data Format Support

The application supports **dual data formats** for seamless PowerSchool integration:

#### New JSON_CLOB Format (PowerSchool Database)
```json
{
  "data": [
    {
      "JSON_CLOB": "{\"inductee\":\"Teacher Name\",\"building\":\"School\",\"assignment\":\"Subject\",\"mentorTeacher\":\"Mentor Name\",\"schoolYearOne\":\"2024-2025\",\"schoolYearTwo\":\"2025-2026\",\"summerAcademy\":[...],\"signatures\":{...}}"
    }
  ]
}
```

#### Legacy Format (Still Supported)
```json
{
  "data": {
    "inductee": "Teacher Name",
    "building": "School Name",
    "assignment": "Subject Area",
    "mentorTeacher": "Mentor Name",
    "schoolYearOne": "2024-2025",
    "schoolYearTwo": "2025-2026",
    "summerAcademy": [...],
    "signatures": {...}
  }
}
```

#### Features
- **Automatic Detection**: Parser automatically identifies data format
- **Backward Compatibility**: Legacy JSON format continues to work
- **Error Handling**: Graceful fallback if JSON_CLOB parsing fails
- **Type Safety**: Full TypeScript support with proper interfaces
- **PowerSchool Integration**: Compatible with `JSON_ARRAYAGG(JSON_OBJECT('JSON_CLOB' VALUE json_clob))` SQL queries

---

## Build Configuration Notes

This project **differs from a standard Svelte 5 + Vite setup** in several ways:

- **Global Svelte Custom Element Mode**
  - The Svelte compiler is configured with `customElement: true` globally.
  - All components are automatically compiled as custom elements.
  - No manual custom element registration code is required.

- **Shadow DOM CSS Injection**
  - `svelte.config.ts` sets `compilerOptions.css = 'injected'` to inject styles into Shadow DOM.
  - `vite.config.ts` disables `emitCss` to inline styles.

- **Dynamic Base Path and Output Directory**
  - `vite.config.ts` reads `package.json` to set `base` and `outDir` dynamically based on the project name.
  - Output is placed under `dist/WEB_ROOT/{projectName}/` to match PowerSchool plugin structure.

- **Predictable File Naming**
  - Rollup options enforce consistent file names (`index.js`, hashed chunks/assets) for easier integration.

- **CSS Modules**
  - Enforces camelCase class names for CSS modules.

These settings optimize the build for **embedding as a PowerSchool plugin** with Shadow DOM encapsulation and predictable asset paths.

---

## Documentation

- [PLANNING.md](PLANNING.md) - Detailed project architecture, goals, and development guidelines
- [TASKS.md](TASKS.md) - Current tasks, priorities, and development roadmap
- [TESTING.md](TESTING.md) - Guidelines for writing and maintaining tests with Svelte 5
- [CLAUDE.md](CLAUDE.md) - Project notes and implementation details

## Getting Started

### Prerequisites

- Node.js (version 18+)
- pnpm (recommended) or npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Build for production:
   ```bash
   pnpm build
   ```

## Project Structure

```
src/
├── lib/                    # Library components and utilities
│   ├── components/         # UI and section components
│   │   ├── sections/       # Form section components
│   │   └── ui/             # Reusable UI components
│   ├── config/             # Configuration files
│   └── stores/             # State management
├── powerschool/            # PowerSchool integration files
├── assets/                 # Static assets
├── custom-element.ts       # Web Component definition
├── lib-components.ts       # Auto-registration of components
├── main.ts                 # Application entry point
└── App.svelte              # Main application component
```

## Running Tests

```bash
pnpm test           # Run tests once
pnpm test:watch     # Run tests in watch mode
pnpm test:coverage  # Run tests with coverage report
```

## Deployment

The application builds to a specific directory structure suitable for web deployment. For PowerSchool integration, the compiled files should be placed in the appropriate PowerSchool web directories as specified in the `powerschool` folder.

## Web Component Usage

This application is built as a Web Component that can be embedded in any HTML page:

```html
<teacher-induction-log-app></teacher-induction-log-app>
```

The component accepts the following attributes:
- `data`: JSON string containing form data
- `editable`: JSON string defining which fields can be edited
- `user-role`: String specifying the user role ('teacher' or 'admin')

## Development Workflow

1. Review [PLANNING.md](PLANNING.md) for architecture and design guidelines
2. Check [TASKS.md](TASKS.md) for current priorities and tasks
3. Read [TESTING.md](TESTING.md) for guidelines on writing tests
4. Implement changes following the established patterns
5. Write tests for new functionality
6. Update documentation as needed
7. Build and test the deployment package

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries, please contact the T/E School District Technology Department.
