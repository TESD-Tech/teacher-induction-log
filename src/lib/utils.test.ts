import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, formatDate, isValidDate, generateId, isValidEmail, isValidPhone, isValidBuildingCode, isValidText } from './utils';

describe('utils', () => {

  // Tests for debounce function
  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should delay function execution', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous timeout if called again within wait period', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      vi.advanceTimersByTime(50);
      
      debouncedFn();
      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the debounced function', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test', 123);
      vi.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledWith('test', 123);
    });
  });

  // Tests for formatDate function
  describe('formatDate', () => {
    it('should format a valid date string to MM/DD/YYYY', () => {
      // Test with ISO format dates which are unambiguous
      expect(formatDate('2023-05-15T12:00:00Z')).toBe('05/15/2023');
      
      // Test empty string
      expect(formatDate('')).toBe('');
      
      // Test invalid date
      expect(formatDate('invalid-date')).toBe('invalid-date');
    });

    it('should return empty string for empty input', () => {
      expect(formatDate('')).toBe('');
    });

    it('should return the original string if date is invalid', () => {
      expect(formatDate('invalid-date')).toBe('invalid-date');
    });

    it('should handle exceptions by returning the original string', () => {
      // Mock Date constructor to throw an error
      const originalDate = global.Date;
      global.Date = function() { throw new Error('Date error'); } as any;
      global.Date.prototype = originalDate.prototype;

      expect(formatDate('causing-error')).toBe('causing-error');

      // Restore original Date constructor
      global.Date = originalDate;
    });
  });

  // Tests for isValidDate function
  describe('isValidDate', () => {
    it('should return true for valid dates in MM/DD/YYYY format', () => {
      expect(isValidDate('01/01/2023')).toBe(true);
      expect(isValidDate('12/31/2023')).toBe(true);
      expect(isValidDate('2/28/2020')).toBe(true); // Leap year
    });

    it('should return false for empty string', () => {
      expect(isValidDate('')).toBe(false);
    });

    it('should return false for invalid date formats', () => {
      expect(isValidDate('2023-01-01')).toBe(false); // Wrong format
      expect(isValidDate('01-01-2023')).toBe(false); // Wrong format
      expect(isValidDate('Jan 1, 2023')).toBe(false); // Wrong format
    });

    it('should return false for invalid dates', () => {
      expect(isValidDate('13/01/2023')).toBe(false); // Invalid month
      expect(isValidDate('01/32/2023')).toBe(false); // Invalid day
      expect(isValidDate('02/30/2023')).toBe(false); // Invalid day for February
    });
  });

  // Tests for generateId function
  describe('generateId', () => {
    it('should generate a unique string', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(typeof id1).toBe('string');
      expect(id1).not.toBe(id2); // Two generated IDs should be different
    });

    it('should generate string containing timestamp component', () => {
      const nowTimestamp = Date.now().toString(36);
      vi.spyOn(Date, 'now').mockImplementation(() => parseInt(nowTimestamp, 36));
      
      const id = generateId();
      expect(id.startsWith(nowTimestamp)).toBe(true);
      
      vi.restoreAllMocks();
    });
  });

  // Tests for isValidEmail function
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(isValidEmail('first.last@example.edu')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('should return false for invalid email formats', () => {
      expect(isValidEmail('plainaddress')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
      expect(isValidEmail('user@domain..com')).toBe(false);
    });
  });

  // Tests for isValidPhone function
  describe('isValidPhone', () => {
    it('should return true for valid US phone numbers', () => {
      expect(isValidPhone('1234567890')).toBe(true);
      expect(isValidPhone('(123) 456-7890')).toBe(true);
      expect(isValidPhone('123-456-7890')).toBe(true);
      expect(isValidPhone('123.456.7890')).toBe(true);
      expect(isValidPhone('+1 123-456-7890')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isValidPhone('')).toBe(false);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isValidPhone('123-45-7890')).toBe(false); // Too short
      expect(isValidPhone('12345678901')).toBe(false); // Too long without country code
      expect(isValidPhone('abc-def-ghij')).toBe(false); // Contains letters
      expect(isValidPhone('123 456 789')).toBe(false); // Missing a digit
    });
  });

  // Tests for isValidBuildingCode function
  describe('isValidBuildingCode', () => {
    it('should return true for valid building codes', () => {
      expect(isValidBuildingCode('ES-001')).toBe(true);
      expect(isValidBuildingCode('MS2')).toBe(true);
      expect(isValidBuildingCode('HS-MAIN')).toBe(true);
      expect(isValidBuildingCode('A1')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isValidBuildingCode('')).toBe(false);
    });

    it('should return false for invalid building codes', () => {
      expect(isValidBuildingCode('TOO-LONG-CODE-1234')).toBe(false); // Too long
      expect(isValidBuildingCode('ES/001')).toBe(false); // Invalid character
      expect(isValidBuildingCode(' ')).toBe(false); // Just whitespace
    });
  });

  // Tests for isValidText function
  describe('isValidText', () => {
    it('should return true for valid text', () => {
      expect(isValidText('Hello')).toBe(true);
      expect(isValidText('  Trimmed  ')).toBe(true);
      expect(isValidText('!')).toBe(true);
    });

    it('should return false for empty string and whitespace', () => {
      expect(isValidText('')).toBe(false);
      expect(isValidText('   ')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isValidText(null as any)).toBe(false);
      expect(isValidText(undefined as any)).toBe(false);
    });
  });
});
