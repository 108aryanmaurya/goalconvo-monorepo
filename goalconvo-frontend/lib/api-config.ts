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
  
  // API endpoints
  endpoints: {
    runPipeline: '/api/run-pipeline',
    health: '/health',
    versions: '/api/versions',
    versionDialogues: (id: string) => `/api/versions/${id}/dialogues`,
    versionCompare: '/api/versions/compare',
    versionTag: (id: string) => `/api/versions/${id}/tag`,
    versionExport: (id: string) => `/api/versions/${id}/export`,
    humanEvalTasks: '/api/human-evaluation/tasks',
    humanEvalTasksBatch: '/api/human-evaluation/tasks/batch',
    humanEvalTask: (id: string) => `/api/human-evaluation/tasks/${id}`,
    humanEvalAnnotate: '/api/human-evaluation/annotate',
    humanEvalDialogueAnnotations: (dialogueId: string) => `/api/human-evaluation/dialogues/${dialogueId}/annotations`,
    humanEvalAgreement: '/api/human-evaluation/agreement',
    humanEvalStatistics: '/api/human-evaluation/statistics',
    humanEvalExport: '/api/human-evaluation/export',
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
  
  // Check if backend is available (with timeout to avoid hanging)
  checkHealth: async (): Promise<boolean> => {
    const url = API_CONFIG.getUrl(API_CONFIG.endpoints.health);
    const timeoutMs = 5000;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      // Network error, connection refused, or timeout - backend likely not running or wrong URL
      if (process.env.NODE_ENV === 'development') {
        console.warn('Backend health check failed (is it running at %s?):', url, error);
      }
      return false;
    }
  },
};


