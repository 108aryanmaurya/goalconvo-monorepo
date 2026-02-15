/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints.
 * Set NEXT_PUBLIC_API_URL environment variable to point to Flask backend.
 * Defaults to http://localhost:5000 for development.
 */

export const API_CONFIG = {
  // Flask backend URL - can be overridden with NEXT_PUBLIC_API_URL env var
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  
  // API endpoints - only unified pipeline endpoint
  endpoints: {
    runPipeline: '/api/run-pipeline',
    health: '/health',
  },
  
  // WebSocket URL - returns the base URL for socket.io connection
  getSocketUrl: (): string => {
    try {
      // If baseUrl is already a full URL, extract origin
      if (API_CONFIG.baseUrl.startsWith('http://') || API_CONFIG.baseUrl.startsWith('https://')) {
        const url = new URL(API_CONFIG.baseUrl);
        return url.origin;
      }
      // Otherwise, assume http://localhost:5000
      return API_CONFIG.baseUrl;
    } catch (error) {
      console.error('Error parsing socket URL:', error);
      return 'http://localhost:5000';
    }
  },
  
  // Get full URL for an endpoint
  getUrl: (endpoint: string): string => {
    return `${API_CONFIG.baseUrl}${endpoint}`;
  },
  
  // Check if backend is available
  checkHealth: async (): Promise<boolean> => {
    try {
      const response = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.health));
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  },
};


