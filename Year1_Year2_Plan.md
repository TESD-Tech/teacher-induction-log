# Plan: Add Separate Year 1 and Year 2 Initials Columns

Based on analysis of the teacher induction log project, here's a comprehensive plan to replace the single "verification" column with separate "Year 1 Initials" and "Year 2 Initials" columns.

## Current State Analysis

- The application uses a single "verification" field for initials in all activity tables
- The `BaseActivity` interface in `formStore.ts` currently has a `verification` field
- All section configurations use `verification` as the field key
- The generic section component handles verification fields as text inputs

## Implementation Plan

### Phase 1: Update Data Structure (formStore.ts)

1. **Modify BaseActivity interface:**
   ```typescript
   export interface BaseActivity {
     dateYearOne: string;
     dateYearTwo: string;
     initialsYearOne: string;  // Replace 'verification'
     initialsYearTwo: string;  // New field
   }
   ```

2. **Update the migration function:**
   - The `migrateFormData` function already exists and handles this transition
   - It migrates old "verification" field to both new initials fields
   - No changes needed here - it's already prepared for this change

3. **Update `createEmptyActivity` function:**
   ```typescript
   export function createEmptyActivity<T extends BaseActivity>(additionalProps: Omit<T, keyof BaseActivity>): T {
     return {
       dateYearOne: "",
       dateYearTwo: "", 
       initialsYearOne: "",  // Replace verification
       initialsYearTwo: "",  // New field
       ...additionalProps
     } as T;
   }
   ```

### Phase 2: Update Section Configuration (sectionConfigs.ts)

1. **Add new field type:**
   ```typescript
   export type FieldType = 'text' | 'date' | 'initialsYearOne' | 'initialsYearTwo' | 'static';
   ```

2. **Update each section configuration:**
   - Replace single verification field with two initials fields
   - Update headers to include both "Year 1 Initials" and "Year 2 Initials"
   - Adjust column widths to accommodate the new column

   Example for mentor meetings:
   ```typescript
   headers: ['Date', 'Topic', 'Date (Year 1)', 'Date (Year 2)', 'Year 1 Initials', 'Year 2 Initials', 'Actions'],
   columnWidths: ['12%', '28%', '12%', '12%', '12%', '12%', '12%'],
   fields: [
     { type: 'date', key: 'date' },
     { type: 'text', key: 'topic' },
     { type: 'date', key: 'dateYearOne' },
     { type: 'date', key: 'dateYearTwo' },
     { type: 'initialsYearOne', key: 'initialsYearOne', placeholder: 'Initials' },
     { type: 'initialsYearTwo', key: 'initialsYearTwo', placeholder: 'Initials' }
   ]
   ```

### Phase 3: Update Generic Section Component (GenericSection.svelte)

1. **Add handling for new field types:**
   ```svelte
   {:else if field.type === 'initialsYearOne'}
     {#if canEdit($formConfigStore.userRole, config.id, field.key)}
       <input
         type="text" 
         bind:value={item[field.key]} 
         placeholder={field.placeholder || 'Initials'}
         maxlength="10"
       />
     {:else}
       <div class="readonly-field">{item[field.key]}</div>
     {/if}
   {:else if field.type === 'initialsYearTwo'}
     {#if canEdit($formConfigStore.userRole, config.id, field.key)}
       <input
         type="text" 
         bind:value={item[field.key]} 
         placeholder={field.placeholder || 'Initials'}
         maxlength="10"
       />
     {:else}
       <div class="readonly-field">{item[field.key]}</div>
     {/if}
   ```

2. **Remove the old verification field handling** (the existing `field.type === 'verification'` block)

### Phase 4: Update Permissions (permissions.ts)

1. **Update permission checking** to handle the new field names:
   - Add permissions for `initialsYearOne` and `initialsYearTwo`
   - Remove permissions for `verification`

### Phase 5: Update CSS Styling

1. **Add specific styling for initials fields:**
   ```css
   .field-type-initialsYearOne,
   .field-type-initialsYearTwo {
     width: 80px;
     text-align: center;
   }
   
   .field-type-initialsYearOne input,
   .field-type-initialsYearTwo input {
     text-align: center;
     font-size: 0.9rem;
   }
   ```

### Phase 6: Testing and Validation

1. **Update unit tests** to reflect the new field structure
2. **Test data migration** from old format to new format
3. **Verify responsive behavior** with additional column
4. **Test all user roles** (admin, mentor, mentee) with new fields

## Implementation Order

1. **Start with formStore.ts** - Update interfaces and helper functions
2. **Update sectionConfigs.ts** - Add new field types and update all sections
3. **Modify GenericSection.svelte** - Add handling for new field types
4. **Update permissions.ts** - Add permissions for new fields
5. **Add CSS styling** - Style the new initials columns
6. **Update tests** - Ensure all tests pass with new structure

## Benefits of This Approach

- **Backward compatibility**: The migration function ensures existing data is preserved
- **Clear separation**: Year 1 and Year 2 initials are clearly distinguished
- **Consistent UX**: Uses the same input patterns as existing fields
- **Responsive design**: Will work well on mobile devices
- **Maintainable**: Follows the existing code patterns and architecture

## Estimated Impact

- **Files to modify**: 3-4 core files
- **Breaking changes**: None (handled by migration)
- **Database impact**: None (uses existing JSON storage)
- **Testing scope**: Medium (need to test migration and new UI)

## Implementation Details

### Files to Modify

1. **src/lib/stores/formStore.ts** - Update interfaces and helper functions
2. **src/lib/config/sectionConfigs.ts** - Add new field types and update configurations
3. **src/lib/components/sections/GenericSection.svelte** - Add handling for new field types
4. **src/lib/permissions.ts** - Update permission checking
5. **CSS files** - Add styling for new initials columns

### Migration Strategy

The existing `migrateFormData` function in `formStore.ts` already handles the transition from the old "verification" field to the new separate initials fields. This ensures:

- No data loss during the transition
- Backward compatibility with existing saved data
- Smooth upgrade path for users

### Testing Strategy

1. **Unit tests** - Update existing tests to handle new field structure
2. **Integration tests** - Test migration from old to new format
3. **User acceptance testing** - Verify all user roles work correctly
4. **Responsive testing** - Ensure mobile compatibility with additional column

This plan maintains the existing architecture while cleanly separating the Year 1 and Year 2 initials functionality. The migration function ensures no data loss, and the modular design makes the implementation straightforward.
