/**
 * Utility functions for handling URL parameters in fetch requests
 */

/**
 * Appends current URL search parameters to a given URL
 * @param baseUrl - The base URL to append parameters to
 * @param preserveParams - Array of parameter names to preserve from current URL (optional, defaults to all)
 * @returns URL with appended parameters
 */
export function appendUrlParameters(baseUrl: string, preserveParams?: string[]): string {
  const currentParams = new URLSearchParams(window.location.search);
  
  // If no specific parameters to preserve are specified, use all current parameters
  const paramsToAdd = new URLSearchParams();
  
  if (preserveParams) {
    // Only preserve specified parameters
    preserveParams.forEach(param => {
      const value = currentParams.get(param);
      if (value !== null) {
        paramsToAdd.set(param, value);
      }
    });
  } else {
    // Preserve all current parameters
    currentParams.forEach((value, key) => {
      paramsToAdd.set(key, value);
    });
  }
  
  // If no parameters to add, return original URL
  if (paramsToAdd.toString() === '') {
    return baseUrl;
  }
  
  // Determine separator based on whether URL already has query parameters
  const separator = baseUrl.includes('?') ? '&' : '?';
  
  return `${baseUrl}${separator}${paramsToAdd.toString()}`;
}

/**
 * Creates a fetch wrapper that automatically appends URL parameters to JSON endpoint requests
 * @param url - The URL to fetch from
 * @param options - Standard fetch options
 * @param preserveParams - Optional array of parameter names to preserve from current URL
 * @returns Promise from fetch
 */
export async function fetchWithUrlParams(
  url: string, 
  options?: RequestInit, 
  preserveParams?: string[]
): Promise<Response> {
  const urlWithParams = appendUrlParameters(url, preserveParams);
  console.log(`[fetchWithUrlParams] Original URL: ${url}`);
  console.log(`[fetchWithUrlParams] URL with params: ${urlWithParams}`);
  
  return fetch(urlWithParams, options);
}
