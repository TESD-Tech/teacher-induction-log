# Svelte 5 Testing Guidelines

## Overview

This document outlines the approach for testing components in the Teacher Induction Log application, which uses Svelte 5 and the Testing Library.

## Current Testing Status

- Current test coverage: ~50.5% of statements
- Target test coverage: 80%
- Components with tests: UI components, Custom Element, App component
- Components needing tests: lib-components.ts, store functionality

## Key Changes for Svelte 5 Testing

The following changes were necessary to make the component tests compatible with Svelte 5:

1. **Vitest Configuration**:
   - Added the `svelteTesting` plugin from `@testing-library/svelte/vite` to ensure proper browser resolution
   - Configured `resolveBrowser: true` to use browser code instead of server-side rendering

2. **Component API Changes**:
   - Svelte 5 components are functions, not classes
   - Replaced `$on` event listener approach with function props
   - Replaced `$set` for updating props with the `rerender` function

3. **Slot Content Testing**:
   - Removed the use of `innerHTML` option which is no longer supported
   - Use `props.$$slots` instead for slot testing when needed
   - For simpler cases, test for container elements that would hold slot content

4. **Event Handling**:
   - Use `fireEvent` or `userEvent` for triggering events
   - Pass event handler functions as props instead of using `$on`

## Test Structure Best Practices

1. **Import Statements**:
   ```typescript
   import { describe, it, expect, vi, beforeEach } from 'vitest';
   import { render, screen, fireEvent } from '@testing-library/svelte';
   import ComponentToTest from './ComponentToTest.svelte';
   ```

2. **Basic Component Rendering**:
   ```typescript
   it('renders correctly', () => {
     render(ComponentToTest, { 
       props: { 
         // Props go here
       }
     });
     
     // Use screen queries for assertions
     expect(screen.getByText('Expected Text')).toBeInTheDocument();
   });
   ```

3. **Testing Props**:
   ```typescript
   it('uses the provided props', () => {
     const { container } = render(ComponentToTest, { 
       props: { 
         propName: 'value'
       }
     });
     
     // Test prop effects on rendering
     const element = container.querySelector('.some-class');
     expect(element).toHaveTextContent('value');
   });
   ```

4. **Event Handling**:
   ```typescript
   it('handles events correctly', async () => {
     // Create mock handler
     const handleClick = vi.fn();
     
     // Render with prop for event handler
     render(ComponentToTest, { 
       props: { 
         onclick: handleClick
       }
     });
     
     // Trigger event
     const button = screen.getByRole('button');
     await fireEvent.click(button);
     
     // Assert handler was called
     expect(handleClick).toHaveBeenCalledTimes(1);
   });
   ```

5. **Testing Component Updates**:
   ```typescript
   it('updates when props change', () => {
     const { rerender } = render(ComponentToTest, { 
       props: { 
         value: 'initial'
       }
     });
     
     // First assertion
     expect(screen.getByText('initial')).toBeInTheDocument();
     
     // Rerender with new props
     rerender({ 
       value: 'updated'
     });
     
     // Assert the update took effect
     expect(screen.getByText('updated')).toBeInTheDocument();
   });
   ```

## Testing Forms and Tables

For components that contain forms and tables, use these patterns:

1. **Testing Form Inputs**:
   ```typescript
   it('updates when form input changes', async () => {
     render(FormComponent);
     
     // Find the input
     const input = screen.getByLabelText('First Name');
     
     // Change its value
     await fireEvent.input(input, { target: { value: 'John' } });
     
     // Check if value has been updated
     expect(input).toHaveValue('John');
   });
   ```

2. **Testing Table Rows**:
   ```typescript
   it('renders correct number of rows', () => {
     const data = [
       { id: 1, name: 'Item 1' },
       { id: 2, name: 'Item 2' }
     ];
     
     render(TableComponent, { props: { items: data } });
     
     // Check number of rows (accounting for header row)
     const rows = screen.getAllByRole('row');
     expect(rows.length).toBe(data.length + 1);
   });
   ```

## Testing Slots

For components that use slots, there are two main approaches:

1. **Test the Containers**:
   ```typescript
   it('provides a container for slot content', () => {
     const { container } = render(ComponentWithSlot);
     const slotContainer = container.querySelector('.slot-container');
     expect(slotContainer).toBeTruthy();
   });
   ```

2. **Use $$slots for Advanced Cases**:
   ```typescript
   it('renders slot content', () => {
     const { container } = render(ComponentWithSlot, {
       props: {
         $$slots: {
           default: [() => 'Slot Content']
         }
       }
     });
     
     expect(container.textContent).toContain('Slot Content');
   });
   ```

## Testing Stores

For testing store functionality:

```typescript
import { get } from 'svelte/store';
import { formStore, addMentorMeeting, removeMentorMeeting } from './formStore';

describe('formStore', () => {
  it('adds a mentor meeting', () => {
    // Get initial state
    const initialState = get(formStore);
    const initialCount = initialState.mentorMeetings.length;
    
    // Add a meeting
    addMentorMeeting();
    
    // Check if a meeting was added
    const updatedState = get(formStore);
    expect(updatedState.mentorMeetings.length).toBe(initialCount + 1);
  });
});
```

## Common Issues and Solutions

1. **Mount Not Available on Server**:
   - If you encounter "mount() is not available on the server", ensure the svelteTesting plugin is configured correctly with `resolveBrowser: true`

2. **Unknown Svelte Options Error**:
   - If you see "Unknown options: [ innerHTML ]", update to use $$slots or test the slot container instead

3. **Component API Changed Error**:
   - If you see "Something called `$on(...)` on an instance of Component", update to use function props for event handling

4. **Date Issues in JSDOM**:
   - Date handling in JSDOM can be problematic. Consider mocking Date functionality or simplifying tests that interact with dates.

5. **Shadow DOM Testing**:
   - To test components inside Shadow DOM, use `container.shadowRoot.querySelector()` instead of `container.querySelector()`

## Writing Tests for Custom Elements

For testing custom elements:

```typescript
describe('SvelteAppElement', () => {
  it('renders correctly', () => {
    // Create and append the custom element
    const element = document.createElement('teacher-induction-log-app');
    document.body.appendChild(element);
    
    // Verify it has a shadow root
    expect(element.shadowRoot).toBeTruthy();
    
    // Check if the app container exists in shadow DOM
    const appContainer = element.shadowRoot?.querySelector('#svelte-app-container');
    expect(appContainer).toBeTruthy();
    
    // Clean up
    document.body.removeChild(element);
  });
});
```

## Testing Strategy

1. **Component Testing Priority**:
   - Focus on core UI components first
   - Test form interactions and data management functionality
   - Ensure proper rendering based on role permissions
   - Test print functionality

2. **Integration Testing**:
   - Test how components interact within the application
   - Verify data flow between components and stores
   - Test role-based permissions and visibility

3. **Test Coverage Goals**:
   - Aim for 80% statement coverage
   - Focus on critical user paths
   - Prioritize complex logic and data processing functions

## Additional Resources

- [Testing Library Documentation](https://testing-library.com/docs/svelte-testing-library/intro)
- [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide)
- [Vitest Documentation](https://vitest.dev/guide)
