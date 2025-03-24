{
  `path`: `/Users/kempb/Projects/teacher-induction-log/CLAUDE.md`,
  `content`: `# Teacher Induction Log Project Notes

## Overview
The Teacher Induction Log is a Svelte 5 application that uses web components to create a form for tracking teacher induction activities. It's built with TypeScript and uses the Shadow DOM for style encapsulation.

## Key Components

### Architecture
- Uses custom elements via the Web Components API
- Implements Shadow DOM for style isolation
- Built with Svelte 5 and TypeScript
- Uses a store-based state management pattern

### File Structure
- `custom-element.ts` - Defines the main web component
- `lib-components.ts` - Automatically registers components from the lib directory
- `main.ts` - Entry point that imports and initializes everything
- `formStore.ts` - State management for the form data
- `sectionConfigs.ts` - Configuration for different form sections

### Styling
- Successfully implemented Carbon Design System icons via `carbon-icons-svelte`
- Modified background color to a softer cream (#F8F1E5)
- Enhanced table styling with proper borders, padding and alignment
- Improved form layout with consistent spacing and typography

## Important Implementation Details

### Web Component Integration
The application wraps Svelte components as Web Components, which allows them to be embedded in any HTML page with proper style encapsulation. This is achieved through:
- Creating Shadow DOM for style isolation
- Injecting global styles into the shadow root
- Passing properties through attributes

### Form Data Management
- Form data is stored in a centralized store
- Different user roles (admin vs teacher) have different permissions
- Configuration is loaded from an external JSON file
- Uses a reactive approach to update UI when data changes

### UI Enhancements
- Table layout uses `table-layout: fixed` for consistent column widths
- Form elements have proper focus states and hover effects
- Subtle shadows and rounded corners for a more polished look
- Consistent color scheme throughout with CSS variables

## Integration Notes
To integrate this component into another system:
1. Include the compiled JS (from the `dist` directory)
2. Add the custom element tag: `<teacher-induction-log-app></teacher-induction-log-app>`
3. Provide configuration via a JSON file at `/log.json` or a suitable endpoint

## Development Notes
- Use `pnpm` for package management 
- Carbon icons must be imported directly from lib folder: `import Add from \"carbon-icons-svelte/lib/Add.svelte\"`
- JSON configuration file needs to be accessible at development time
- When adding new components to `lib/` they are automatically registered as web components

## Styling Best Practices
- Use CSS variables for consistent colors and spacing
- Apply Shadow DOM compatible styles
- Keep table layouts fixed for predictable column widths
- Use proper contrast ratios for text readability
- Maintain consistent padding and spacing throughout the UI
`
}