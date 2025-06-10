import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { appendUrlParameters, fetchWithUrlParams } from './urlParams';

// Mock window.location
const mockLocation = {
  search: ''
};

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('urlParams utilities', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    mockLocation.search = '';
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('appendUrlParameters', () => {
    it('should return original URL when no current parameters exist', () => {
      mockLocation.search = '';
      const baseUrl = 'https://example.com/api/data.json';
      
      const result = appendUrlParameters(baseUrl);
      
      expect(result).toBe(baseUrl);
    });

    it('should append all current URL parameters to base URL', () => {
      mockLocation.search = '?frn=0053567&gs=true';
      const baseUrl = 'https://example.com/api/data.json';
      
      const result = appendUrlParameters(baseUrl);
      
      expect(result).toBe('https://example.com/api/data.json?frn=0053567&gs=true');
    });

    it('should append parameters to URL that already has query parameters', () => {
      mockLocation.search = '?frn=0053567&gs=true';
      const baseUrl = 'https://example.com/api/data.json?existing=param';
      
      const result = appendUrlParameters(baseUrl);
      
      expect(result).toBe('https://example.com/api/data.json?existing=param&frn=0053567&gs=true');
    });

    it('should only preserve specified parameters when preserveParams is provided', () => {
      mockLocation.search = '?frn=0053567&gs=true&other=value';
      const baseUrl = 'https://example.com/api/data.json';
      
      const result = appendUrlParameters(baseUrl, ['frn', 'gs']);
      
      expect(result).toBe('https://example.com/api/data.json?frn=0053567&gs=true');
    });

    it('should handle empty preserveParams array', () => {
      mockLocation.search = '?frn=0053567&gs=true';
      const baseUrl = 'https://example.com/api/data.json';
      
      const result = appendUrlParameters(baseUrl, []);
      
      expect(result).toBe(baseUrl);
    });

    it('should handle non-existent parameters in preserveParams', () => {
      mockLocation.search = '?frn=0053567';
      const baseUrl = 'https://example.com/api/data.json';
      
      const result = appendUrlParameters(baseUrl, ['frn', 'nonexistent']);
      
      expect(result).toBe('https://example.com/api/data.json?frn=0053567');
    });
  });

  describe('fetchWithUrlParams', () => {
    it('should call fetch with URL parameters appended', async () => {
      mockLocation.search = '?frn=0053567&gs=true';
      const baseUrl = 'https://example.com/api/data.json';
      const mockResponse = { ok: true, json: async () => ({}) };
      mockFetch.mockResolvedValueOnce(mockResponse);
      
      await fetchWithUrlParams(baseUrl);
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/api/data.json?frn=0053567&gs=true',
        undefined
      );
    });

    it('should pass through fetch options', async () => {
      mockLocation.search = '?frn=0053567';
      const baseUrl = 'https://example.com/api/data.json';
      const options = { method: 'POST', headers: { 'Content-Type': 'application/json' } };
      const mockResponse = { ok: true };
      mockFetch.mockResolvedValueOnce(mockResponse);
      
      await fetchWithUrlParams(baseUrl, options);
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/api/data.json?frn=0053567',
        options
      );
    });

    it('should preserve only specified parameters when preserveParams is provided', async () => {
      mockLocation.search = '?frn=0053567&gs=true&other=value';
      const baseUrl = 'https://example.com/api/data.json';
      const mockResponse = { ok: true };
      mockFetch.mockResolvedValueOnce(mockResponse);
      
      await fetchWithUrlParams(baseUrl, undefined, ['frn']);
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/api/data.json?frn=0053567',
        undefined
      );
    });

    it('should return the fetch promise', async () => {
      mockLocation.search = '';
      const baseUrl = 'https://example.com/api/data.json';
      const mockResponse = { ok: true, status: 200 };
      mockFetch.mockResolvedValueOnce(mockResponse);
      
      const result = await fetchWithUrlParams(baseUrl);
      
      expect(result).toBe(mockResponse);
    });

    it('should handle fetch errors properly', async () => {
      mockLocation.search = '?frn=0053567';
      const baseUrl = 'https://example.com/api/data.json';
      const error = new Error('Network error');
      mockFetch.mockRejectedValueOnce(error);
      
      await expect(fetchWithUrlParams(baseUrl)).rejects.toThrow('Network error');
    });
  });

  describe('integration scenarios', () => {
    it('should handle typical PowerSchool URL parameters', () => {
      mockLocation.search = '?frn=0053567&gs=true&ac=prim';
      const baseUrl = '/admin/teacher-induction-log/log.json';
      
      const result = appendUrlParameters(baseUrl);
      
      expect(result).toBe('/admin/teacher-induction-log/log.json?frn=0053567&gs=true&ac=prim');
    });

    it('should handle teacher context parameters', () => {
      mockLocation.search = '?frn=0053567&teachernumber=12345';
      const baseUrl = '/teachers/teacher-induction-log/log.json';
      
      const result = appendUrlParameters(baseUrl);
      
      expect(result).toBe('/teachers/teacher-induction-log/log.json?frn=0053567&teachernumber=12345');
    });

    it('should work with mentor view URLs', () => {
      mockLocation.search = '?frn=0053567&mentee=123&view=mentor';
      const baseUrl = '/teachers/teacher-induction-log/logs/123.json';
      
      const result = appendUrlParameters(baseUrl);
      
      expect(result).toBe('/teachers/teacher-induction-log/logs/123.json?frn=0053567&mentee=123&view=mentor');
    });
  });
});
