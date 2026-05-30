import { useCallback } from 'react';

interface APIOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export const useAPI = (baseUrl: string, csrfToken: string, csrfTokenName: string) => {
  const call = useCallback(
    async (endpoint: string, options: APIOptions = {}) => {
      const { method = 'GET', body, headers = {} } = options;
      const url = new URL(endpoint, baseUrl).toString();

      const requestInit: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      // Add CSRF token for POST/PUT/DELETE
      if (['POST', 'PUT', 'DELETE'].includes(method) && body) {
        const formData = new FormData();
        formData.append(csrfTokenName, csrfToken);

        if (typeof body === 'object') {
          for (const [key, value] of Object.entries(body)) {
            formData.append(key, value as any);
          }
        }

        requestInit.body = formData;
        delete requestInit.headers['Content-Type'];
      }

      try {
        const response = await fetch(url, requestInit);
        const json = await response.json();
        return { ok: response.ok, status: response.status, data: json };
      } catch (error) {
        console.error('API call failed:', error);
        throw error;
      }
    },
    [baseUrl, csrfToken, csrfTokenName]
  );

  return { call };
};
