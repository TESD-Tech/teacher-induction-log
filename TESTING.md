# Svelte 5 Testing Guidelines

## Overview

This document outlines the approach for testing components in the Teacher Induction Log application, which uses Svelte 5 and the Testing Library.

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

## Common Issues and Solutions

1. **Mount Not Available on Server**:
   - If you encounter "mount() is not available on the server", ensure the svelteTesting plugin is configured correctly with `resolveBrowser: true`

2. **Unknown Svelte Options Error**:
   - If you see "Unknown options: [ innerHTML ]", update to use $$slots or test the slot container instead

3. **Component API Changed Error**:
   - If you see "Something called `$on(...)` on an instance of Component", update to use function props for event handling

4. **Date Issues in JSDOM**:
   - Date handling in JSDOM can be problematic. Consider mocking Date functionality or simplifying tests that interact with dates.

## Additional Resources

- [Testing Library Documentation](https://testing-library.com/docs/svelte-testing-library/intro)
- [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide)
- [Vitest Documentation](https://vitest.dev/guide)
