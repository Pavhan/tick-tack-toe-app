export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  basePath: import.meta.env.VITE_API_BASE_PATH || '/api',
  timeout: 10000,
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.basePath}${endpoint}`;
};
