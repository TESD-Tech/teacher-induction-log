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
