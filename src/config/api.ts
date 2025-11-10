export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002',
  timeout: 10000,
} as const;

export const getApiUrl = (endpoint: string): string => {
  const base = API_CONFIG.baseURL.endsWith('/') ? API_CONFIG.baseURL.slice(0, -1) : API_CONFIG.baseURL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};
