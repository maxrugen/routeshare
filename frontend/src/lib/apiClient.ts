// API Client for Routeshare backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Custom error class for API errors
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly response?: Response;

  constructor(message: string, statusCode: number, response?: Response) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

// Response wrapper interface
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  [key: string]: any;
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for session management
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    // Handle non-JSON responses (like image downloads)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('image/')) {
      if (!response.ok) {
        throw new ApiError(
          `Failed to fetch image: ${response.statusText}`,
          response.status,
          response
        );
      }
      return response.blob() as T;
    }

    // Handle JSON responses
    const data: ApiResponse<T> = await response.json();
    
    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
}

// GPX API functions
export const gpxApi = {
  // Upload GPX file
  uploadFile: async (file: File): Promise<{ activityData: any }> => {
    const formData = new FormData();
    formData.append('gpxFile', file);
    
    const response = await fetch(`${API_BASE_URL}/api/gpx/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(
        errorData.message || 'Failed to upload GPX file',
        response.status,
        response
      );
    }

    return response.json();
  },

  // Get sample GPX data
  getSample: async (): Promise<{ activityData: any }> => {
    return apiRequest('/api/gpx/sample');
  },
};

// Overlay API functions
export const overlayApi = {
  // Generate overlay
  generate: async (data: {
    activityData: any;
    backgroundImage?: string;
    overlayStyle?: any;
  }): Promise<Blob> => {
    return apiRequest('/api/overlay/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Generate custom overlay
  generateCustom: async (data: {
    activityData: any;
    backgroundImage?: string;
    customStyle?: any;
  }): Promise<Blob> => {
    return apiRequest('/api/overlay/generate/custom', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get templates
  getTemplates: async (): Promise<{ templates: any[] }> => {
    return apiRequest('/api/overlay/templates');
  },

  // Generate template preview
  generatePreview: async (
    templateId: string,
    data: { activityData: any }
  ): Promise<Blob> => {
    return apiRequest(`/api/overlay/templates/${templateId}/preview`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Auth API functions
export const authApi = {
  // Get Strava profile
  getProfile: async (): Promise<{ athlete: any; isAuthenticated: boolean }> => {
    return apiRequest('/api/auth/profile');
  },

  // Logout
  logout: async (): Promise<{ message: string }> => {
    return apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  },

  // Strava OAuth URL
  getStravaAuthUrl: (): string => {
    return `${API_BASE_URL}/api/auth/strava`;
  },
};

// Utility function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const profile = await authApi.getProfile();
    return profile.isAuthenticated;
  } catch (error) {
    return false;
  }
};

// Export the main API object
export const api = {
  gpx: gpxApi,
  overlay: overlayApi,
  auth: authApi,
  isAuthenticated,
};
