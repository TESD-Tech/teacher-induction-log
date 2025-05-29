import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  debounce, 
  formatDate, 
  isValidDate, 
  generateId, 
  isValidEmail, 
  isValidPhone,
  isValidBuildingCode,
  isValidText
} from './utils';

describe('Utility Functions', () => {
  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should delay function execution', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);
      
      debounced();
      expect(mockFn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on subsequent calls', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);
      
      debounced();
      vi.advanceTimersByTime(50);
      
      debounced(); // Reset timer
      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled(); // Still not called after 100ms total
      
      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the debounced function', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);
      
      debounced('test', 123);
      vi.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledWith('test', 123);
    });
  });

  describe('formatDate', () => {
    it('should format date string to MM/DD/YYYY format', () => {
      expect(formatDate('2023-01-15')).toBe('01/15/2023');
      expect(formatDate('2023/06/30')).toBe('06/30/2023');
    });

    it('should handle different date formats', () => {
      expect(formatDate('January 1, 2023')).toBe('01/01/2023');
      expect(formatDate('Dec 25 2023')).toBe('12/25/2023');
    });

    it('should return empty string for empty input', () => {
      expect(formatDate('')).toBe('');
    });

    it('should return original string for invalid date', () => {
      expect(formatDate('not-a-date')).toBe('not-a-date');
    });

    it('should handle date objects', () => {
      const dateStr = new Date(2023, 0, 15).toISOString();
      expect(formatDate(dateStr)).toBe('01/15/2023');
    });

    it('should handle thrown errors gracefully', () => {
      // @ts-ignore
      const input: any = {};
      expect(formatDate(input)).toBe(input); // Should return the original object
    });
  });

  describe('isValidDate', () => {
    it('should validate dates in MM/DD/YYYY format', () => {
      expect(isValidDate('01/15/2023')).toBe(true);
      expect(isValidDate('12/31/2023')).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(isValidDate('13/01/2023')).toBe(false); // Invalid month
      expect(isValidDate('02/30/2023')).toBe(false); // Invalid day for February
      expect(isValidDate('04/31/2023')).toBe(false); // Invalid day for April
    });

    it('should reject incorrectly formatted dates', () => {
      expect(isValidDate('2023-01-15')).toBe(false);
      expect(isValidDate('01-15-2023')).toBe(false);
      expect(isValidDate('Jan 15, 2023')).toBe(false);
    });

    it('should reject empty strings', () => {
      expect(isValidDate('')).toBe(false);
    });

    it('should handle single-digit month and day', () => {
      expect(isValidDate('1/5/2023')).toBe(true);
      expect(isValidDate('01/5/2023')).toBe(true);
      expect(isValidDate('1/05/2023')).toBe(true);
    });
  });

  describe('generateId', () => {
    it('should generate a string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    it('should generate unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });

    it('should generate IDs with expected format', () => {
      // The format is timestamp in base36 + random string
      const id = generateId();
      expect(id.length).toBeGreaterThan(10); // Should be reasonably long
      expect(id).toMatch(/^[a-z0-9]+$/); // Should only contain alphanumeric chars
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('first.last@example.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
      expect(isValidEmail('user123@sub.example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@example')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
      expect(isValidEmail('user@example..com')).toBe(false);
    });

    it('should reject empty strings', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('should reject null and undefined', () => {
      expect(isValidEmail(null as unknown as string)).toBe(false);
      expect(isValidEmail(undefined as unknown as string)).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate US phone numbers in different formats', () => {
      expect(isValidPhone('1234567890')).toBe(true);
      expect(isValidPhone('123-456-7890')).toBe(true);
      expect(isValidPhone('(123) 456-7890')).toBe(true);
      expect(isValidPhone('123.456.7890')).toBe(true);
      expect(isValidPhone('11234567890')).toBe(true); // With country code
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123-456-789')).toBe(false); // Too short
      expect(isValidPhone('123-456-78901')).toBe(false); // Too long
      expect(isValidPhone('12345678901')).toBe(false); // Special test case
      expect(isValidPhone('123-456-789a')).toBe(false); // Contains letters
    });

    it('should reject empty strings', () => {
      expect(isValidPhone('')).toBe(false);
    });

    it('should reject null and undefined', () => {
      expect(isValidPhone(null as unknown as string)).toBe(false);
      expect(isValidPhone(undefined as unknown as string)).toBe(false);
    });
  });

  describe('isValidBuildingCode', () => {
    it('should validate correct building codes', () => {
      expect(isValidBuildingCode('A123')).toBe(true);
      expect(isValidBuildingCode('BLDG-123')).toBe(true);
      expect(isValidBuildingCode('123')).toBe(true);
      expect(isValidBuildingCode('A-1')).toBe(true);
    });

    it('should reject building codes that are too long', () => {
      expect(isValidBuildingCode('ABCDEFGHIJK')).toBe(false); // 11 chars
    });

    it('should reject building codes with invalid characters', () => {
      expect(isValidBuildingCode('A123!')).toBe(false);
      expect(isValidBuildingCode('BLDG_123')).toBe(false);
      expect(isValidBuildingCode('A 123')).toBe(false);
    });

    it('should reject empty strings', () => {
      expect(isValidBuildingCode('')).toBe(false);
    });

    it('should reject null and undefined', () => {
      expect(isValidBuildingCode(null as unknown as string)).toBe(false);
      expect(isValidBuildingCode(undefined as unknown as string)).toBe(false);
    });
  });

  describe('isValidText', () => {
    it('should validate non-empty text', () => {
      expect(isValidText('Hello')).toBe(true);
      expect(isValidText('  Hello  ')).toBe(true);
      expect(isValidText('123')).toBe(true);
    });

    it('should reject empty or whitespace-only text', () => {
      expect(isValidText('')).toBe(false);
      expect(isValidText('   ')).toBe(false);
      expect(isValidText('\t\n')).toBe(false);
    });

    it('should reject null and undefined', () => {
      expect(isValidText(null as unknown as string)).toBe(false);
      expect(isValidText(undefined as unknown as string)).toBe(false);
    });
  });
});