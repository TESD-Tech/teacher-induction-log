import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import { tick } from 'svelte';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';

import CoverPageTestWrapper from './CoverPageTestWrapper.svelte';

// Mock the permissions module
vi.mock('../../permissions', () => ({
  canEdit: vi.fn((userRole: string, section: string, field: string) => {
    // Default: allow editing for admin, deny for readonly
    return userRole === 'admin';
  })
}));

describe('CoverPage Component', () => {
  let mockFormStore: any;
  let mockFormConfigStore: any;

  beforeEach(() => {
    // Create mock stores with realistic data
    mockFormStore = writable({
      inductee: '',
      building: '',
      assignment: '',
      mentorTeacher: '',
      schoolYearOne: '',
      schoolYearTwo: ''
    });

    mockFormConfigStore = writable({
      userRole: 'admin',
      options: {
        buildings: [
          { dcid: 'elem1', name: 'Elementary School 1' },
          { dcid: 'elem2', name: 'Elementary School 2' },
          { dcid: 'middle1', name: 'Middle School 1' },
          { dcid: 'high1', name: 'High School 1' }
        ],
        assignments: [
          { dcid: 'math', name: 'Mathematics' },
          { dcid: 'english', name: 'English Language Arts' },
          { dcid: 'science', name: 'Science' },
          { dcid: 'social', name: 'Social Studies' }
        ],
        mentors: [
          { dcid: 'smith', name: 'Smith, John' },
          { dcid: 'johnson', name: 'Johnson, Mary' },
          { dcid: 'williams', name: 'Williams, David' }
        ],
        schoolYears: [
          { dcid: '2023-2024', name: '2023-2024' },
          { dcid: '2024-2025', name: '2024-2025' },
          { dcid: '2025-2026', name: '2025-2026' }
        ]
      }
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe('Editable mode (admin user)', () => {
    it('renders all form fields as editable inputs', () => {
      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      // Check that all fields are present and editable
      expect(screen.getByLabelText('Inductee Name')).toBeInTheDocument();
      expect(screen.getByLabelText('School Building')).toBeInTheDocument();
      expect(screen.getByLabelText('Teaching Assignment')).toBeInTheDocument();
      expect(screen.getByLabelText('Mentor Teacher Name')).toBeInTheDocument();
      expect(screen.getByLabelText('School Year One')).toBeInTheDocument();
      expect(screen.getByLabelText('School Year Two')).toBeInTheDocument();

      // Verify they are input elements, not readonly divs
      expect(screen.getByLabelText('Inductee Name')).toBeInstanceOf(HTMLInputElement);
      expect(screen.getByLabelText('School Building')).toBeInstanceOf(HTMLSelectElement);
      expect(screen.getByLabelText('Teaching Assignment')).toBeInstanceOf(HTMLSelectElement);
      expect(screen.getByLabelText('Mentor Teacher Name')).toBeInstanceOf(HTMLSelectElement);
      expect(screen.getByLabelText('School Year One')).toBeInstanceOf(HTMLSelectElement);
      expect(screen.getByLabelText('School Year Two')).toBeInstanceOf(HTMLSelectElement);
    });

    it('allows entering text in inductee field', async () => {
      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      const inducteeInput = screen.getByLabelText('Inductee Name');
      await fireEvent.input(inducteeInput, { target: { value: 'Doe, Jane' } });
      
      expect(inducteeInput).toHaveValue('Doe, Jane');
    });

    it('displays placeholder text for inductee field', () => {
      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      const inducteeInput = screen.getByLabelText('Inductee Name');
      expect(inducteeInput).toHaveAttribute('placeholder', 'Last, First');
    });

    it('shows all building options in select dropdown', () => {
      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      const buildingSelect = screen.getByLabelText('School Building');
      expect(buildingSelect).toContainHTML('Elementary School 1');
      expect(buildingSelect).toContainHTML('Elementary School 2');
      expect(buildingSelect).toContainHTML('Middle School 1');
      expect(buildingSelect).toContainHTML('High School 1');
    });

    it('shows all assignment options in select dropdown', () => {
      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      const assignmentSelect = screen.getByLabelText('Teaching Assignment');
      expect(assignmentSelect).toContainHTML('Mathematics');
      expect(assignmentSelect).toContainHTML('English Language Arts');
      expect(assignmentSelect).toContainHTML('Science');
      expect(assignmentSelect).toContainHTML('Social Studies');
    });

    it('shows all mentor options in select dropdown', () => {
      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      const mentorSelect = screen.getByLabelText('Mentor Teacher Name');
      expect(mentorSelect).toContainHTML('Smith, John');
      expect(mentorSelect).toContainHTML('Johnson, Mary');
      expect(mentorSelect).toContainHTML('Williams, David');
    });

    it('shows all school year options in both year dropdowns', () => {
      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      const yearOneSelect = screen.getByLabelText('School Year One');
      const yearTwoSelect = screen.getByLabelText('School Year Two');
      
      // Both selects should have the same options
      expect(yearOneSelect).toContainHTML('2023-2024');
      expect(yearOneSelect).toContainHTML('2024-2025');
      expect(yearOneSelect).toContainHTML('2025-2026');
      
      expect(yearTwoSelect).toContainHTML('2023-2024');
      expect(yearTwoSelect).toContainHTML('2024-2025');
      expect(yearTwoSelect).toContainHTML('2025-2026');
    });

    it('updates form store when building selection changes', async () => {
      let currentFormData: any;
      mockFormStore.subscribe((data: any) => currentFormData = data);

      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      const buildingSelect = screen.getByLabelText('School Building');
      await fireEvent.change(buildingSelect, { target: { value: 'elem1' } });
      await tick();
      
      expect(currentFormData.building).toBe('elem1');
    });

    it('updates form store when assignment selection changes', async () => {
      let currentFormData: any;
      mockFormStore.subscribe((data: any) => currentFormData = data);

      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      const assignmentSelect = screen.getByLabelText('Teaching Assignment');
      await fireEvent.change(assignmentSelect, { target: { value: 'math' } });
      await tick();
      
      expect(currentFormData.assignment).toBe('math');
    });

    it('updates form store when mentor selection changes', async () => {
      let currentFormData: any;
      mockFormStore.subscribe((data: any) => currentFormData = data);

      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      const mentorSelect = screen.getByLabelText('Mentor Teacher Name');
      await fireEvent.change(mentorSelect, { target: { value: 'smith' } });
      await tick();
      
      expect(currentFormData.mentorTeacher).toBe('smith');
    });

    it('updates form store when school year selections change', async () => {
      let currentFormData: any;
      mockFormStore.subscribe((data: any) => currentFormData = data);

      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      const yearOneSelect = screen.getByLabelText('School Year One');
      const yearTwoSelect = screen.getByLabelText('School Year Two');
      
      await fireEvent.change(yearOneSelect, { target: { value: '2023-2024' } });
      await tick();
      await fireEvent.change(yearTwoSelect, { target: { value: '2024-2025' } });
      await tick();
      
      expect(currentFormData.schoolYearOne).toBe('2023-2024');
      expect(currentFormData.schoolYearTwo).toBe('2024-2025');
    });

    it('displays placeholder text for all select fields', () => {
      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      // Check that placeholders are rendered as the first option
      expect(screen.getByText('-- Select Building --')).toBeInTheDocument();
      expect(screen.getByText('-- Select Assignment --')).toBeInTheDocument();
      expect(screen.getByText('-- Select Mentor --')).toBeInTheDocument();
      const yearPlaceholders = screen.getAllByText('-- Select Year --');
      expect(yearPlaceholders).toHaveLength(2); // Year 1 and Year 2 selects
    });
  });

  describe('Readonly mode (non-admin user)', () => {
    beforeEach(() => {
      // Get the mocked permissions module and set up the mock for readonly user
      const permissionsMock = vi.mocked(vi.doMock('../../permissions', () => ({
        canEdit: vi.fn((userRole: string, section: string, field: string) => {
          return userRole === 'admin'; // Only admin can edit
        })
      })));
      
      // Update form config store to reflect readonly user
      mockFormConfigStore.update((config: any) => ({
        ...config,
        userRole: 'readonly'
      }));

      // Set some values in the form store to test display
      mockFormStore.update((data: any) => ({
        ...data,
        inductee: 'Doe, Jane',
        building: 'elem1',
        assignment: 'math',
        mentorTeacher: 'smith',
        schoolYearOne: '2023-2024',
        schoolYearTwo: '2024-2025'
      }));
    });

    it('renders all fields as readonly divs', () => {
      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      // Verify that fields are displayed as readonly divs, not inputs
      expect(screen.queryByLabelText('Inductee Name')).not.toBeInstanceOf(HTMLInputElement);
      expect(screen.queryByLabelText('School Building')).not.toBeInstanceOf(HTMLSelectElement);
      expect(screen.queryByLabelText('Teaching Assignment')).not.toBeInstanceOf(HTMLSelectElement);
      expect(screen.queryByLabelText('Mentor Teacher Name')).not.toBeInstanceOf(HTMLSelectElement);
      expect(screen.queryByLabelText('School Year One')).not.toBeInstanceOf(HTMLSelectElement);
      expect(screen.queryByLabelText('School Year Two')).not.toBeInstanceOf(HTMLSelectElement);

      // Check that values are displayed
      expect(screen.getByText('Doe, Jane')).toBeInTheDocument();
      expect(screen.getByText('elem1')).toBeInTheDocument();
      expect(screen.getByText('math')).toBeInTheDocument();
      expect(screen.getByText('smith')).toBeInTheDocument();
      expect(screen.getByText('2023-2024')).toBeInTheDocument();
      expect(screen.getByText('2024-2025')).toBeInTheDocument();
    });

    it('displays empty space for unset fields in readonly mode', () => {
      // Reset form store to empty values
      mockFormStore.set({
        inductee: '',
        building: '',
        assignment: '',
        mentorTeacher: '',
        schoolYearOne: '',
        schoolYearTwo: ''
      });

      const { container } = render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      // Check that readonly divs are present for empty fields
      const readonlyFields = container.querySelectorAll('.readonly-field');
      expect(readonlyFields).toHaveLength(6); // One for each field
      
      // Check that they contain empty text (normalized to be empty)
      readonlyFields.forEach(field => {
        expect(field.textContent?.trim()).toBe('');
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper fieldset and legend structure', () => {
      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      const fieldset = screen.getByRole('group', { name: 'Inductee Information' });
      expect(fieldset).toBeInTheDocument();
      expect(fieldset.tagName).toBe('FIELDSET');

      const legend = screen.getByText('Inductee Information');
      expect(legend.tagName).toBe('LEGEND');
    });

    it('associates labels with form controls properly', () => {
      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      // Each labeled control should be properly associated
      const inducteeInput = screen.getByLabelText('Inductee');
      const buildingSelect = screen.getByLabelText('Building');
      const assignmentSelect = screen.getByLabelText('Assignment');
      const mentorSelect = screen.getByLabelText('Mentor Teacher');
      const yearOneSelect = screen.getByLabelText('School Year (Year 1)');
      const yearTwoSelect = screen.getByLabelText('School Year (Year 2)');

      expect(inducteeInput).toBeInTheDocument();
      expect(buildingSelect).toBeInTheDocument();
      expect(assignmentSelect).toBeInTheDocument();
      expect(mentorSelect).toBeInTheDocument();
      expect(yearOneSelect).toBeInTheDocument();
      expect(yearTwoSelect).toBeInTheDocument();
    });

    it('has required attributes on select fields', () => {
      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      expect(screen.getByLabelText('School Building')).toHaveAttribute('required');
      expect(screen.getByLabelText('Teaching Assignment')).toHaveAttribute('required');
      expect(screen.getByLabelText('Mentor Teacher Name')).toHaveAttribute('required');
      expect(screen.getByLabelText('School Year One')).toHaveAttribute('required');
      expect(screen.getByLabelText('School Year Two')).toHaveAttribute('required');
    });

    it('has proper CSS classes for styling', () => {
      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      // Check for form input classes
      expect(screen.getByLabelText('Inductee Name')).toHaveClass('form-input');
      expect(screen.getByLabelText('School Building')).toHaveClass('form-input');
      expect(screen.getByLabelText('Teaching Assignment')).toHaveClass('form-input');
      expect(screen.getByLabelText('Mentor Teacher Name')).toHaveClass('form-input');
      
      // Check for year-specific classes
      expect(screen.getByLabelText('School Year One')).toHaveClass('form-input', 'year-input');
      expect(screen.getByLabelText('School Year Two')).toHaveClass('form-input', 'year-input');
    });
  });

  describe('Edge cases and error handling', () => {
    it('handles missing options gracefully', () => {
      // Create config with missing options
      const emptyConfigStore = writable({
        userRole: 'admin',
        options: {
          buildings: [],
          assignments: [],
          mentors: [],
          schoolYears: []
        }
      });

      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: emptyConfigStore
      });

      // Should still render selects, just with no options (except placeholder)
      expect(screen.getByLabelText('School Building')).toBeInTheDocument();
      expect(screen.getByLabelText('Teaching Assignment')).toBeInTheDocument();
      expect(screen.getByLabelText('Mentor Teacher Name')).toBeInTheDocument();
      expect(screen.getByLabelText('School Year One')).toBeInTheDocument();
      expect(screen.getByLabelText('School Year Two')).toBeInTheDocument();
    });

    it('handles undefined options gracefully', () => {
      // Create config with undefined options
      const undefinedConfigStore = writable({
        userRole: 'admin',
        options: {}
      });

      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: undefinedConfigStore
      });

      // Should still render without crashing
      expect(screen.getByLabelText('School Building')).toBeInTheDocument();
      expect(screen.getByLabelText('Teaching Assignment')).toBeInTheDocument();
    });

    it('preserves existing form values when rendering', () => {
      // Set initial values
      mockFormStore.set({
        inductee: 'Existing, Teacher',
        building: 'middle1',
        assignment: 'english',
        mentorTeacher: 'johnson',
        schoolYearOne: '2024-2025',
        schoolYearTwo: '2025-2026'
      });

      render(CoverPageTestWrapper, {
        formStore: mockFormStore,
        formConfigStore: mockFormConfigStore
      });

      // Check that existing values are preserved and displayed
      expect(screen.getByLabelText('Inductee Name')).toHaveValue('Existing, Teacher');
      expect(screen.getByLabelText('School Building')).toHaveValue('middle1');
      expect(screen.getByLabelText('Teaching Assignment')).toHaveValue('english');
      expect(screen.getByLabelText('Mentor Teacher Name')).toHaveValue('johnson');
      expect(screen.getByLabelText('School Year One')).toHaveValue('2024-2025');
      expect(screen.getByLabelText('School Year Two')).toHaveValue('2025-2026');
    });
  });
});
