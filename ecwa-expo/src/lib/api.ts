/**
 * API Configuration and Service for React Native
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// TEMPORARILY DISABLED: Base URL scrapped due to backend issues
// To re-enable: Set USE_API to true and configure API_BASE_URL below
const USE_API = false; // Set to true to enable API calls

// Get API base URL from environment or use default
// Priority: EXPO_PUBLIC_API_BASE_URL > app.json extra.apiBaseUrl > default
// For mobile devices, use your computer's IP address instead of localhost
// Example: http://192.168.1.100:8000/api
const API_BASE_URL = 
  (process.env.EXPO_PUBLIC_API_BASE_URL as string) ||
  (Constants.expoConfig?.extra?.apiBaseUrl as string) || 
  'http://localhost:8000/api';

// Log the API URL for debugging (remove in production)
if (__DEV__ && USE_API) {
  console.log('API Base URL:', API_BASE_URL);
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string | string[];
  message?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  api_token: string;
  created_at?: string;
  updated_at?: string;
  appUser?: {
    id: number;
    user_id: number;
    dcc?: string;
    lcb?: string;
    language?: string;
    mobile?: string | null;
    has_latest_updates?: number;
  };
}

/**
 * Get API token from AsyncStorage
 */
export const getApiToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('apiToken');
};

/**
 * Set API token in AsyncStorage
 */
export const setApiToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem('apiToken', token);
};

/**
 * Remove API token from AsyncStorage
 */
export const removeApiToken = async (): Promise<void> => {
  await AsyncStorage.removeItem('apiToken');
};

/**
 * Make API request with error handling
 * TEMPORARILY DISABLED: Returns mock error when USE_API is false
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // TEMPORARILY DISABLED: API calls are disabled
  if (!USE_API) {
    throw new Error('API is temporarily disabled. Backend configuration is being updated.');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const data = await response.json();
        if (Array.isArray(data)) {
          errorMessage = data[0] || 'An error occurred';
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = typeof data.error === 'string' ? data.error : data.error[0] || 'An error occurred';
        }
      } catch (parseError) {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || `Server error (${response.status})`;
      }
      throw new Error(errorMessage);
    }

    // Parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error('Invalid response from server');
    }

    return data;
  } catch (error) {
    // Handle network errors specifically
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network request failed. Please check your internet connection and ensure the API server is running. For mobile devices, make sure you\'re using your computer\'s IP address instead of localhost.');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

/**
 * Make authenticated API request
 * TEMPORARILY DISABLED: API calls are disabled
 */
async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // TEMPORARILY DISABLED: API calls are disabled
  if (!USE_API) {
    throw new Error('API is temporarily disabled. Backend configuration is being updated.');
  }

  const token = await getApiToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      apiToken: token,
    },
  });
}

/**
 * Authentication API Service
 */
export const authApi = {
  /**
   * Send login code to email
   */
  async sendLoginCode(email: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/user/login/send-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Verify login code
   */
  async verifyLoginCode(email: string, code: string): Promise<User> {
    return apiRequest<User>('/user/login/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  /**
   * Authenticate by email (check if user exists)
   */
  async authenticateByEmail(email: string): Promise<User> {
    return apiRequest<User>('/user/authenticate', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<User> {
    return apiRequest<User>('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Register new user
   */
  async register(userData: {
    name: string;
    email: string;
    password?: string;
    dcc?: string;
    lcb?: string;
    language?: string;
  }): Promise<User> {
    return apiRequest<User>('/user/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Get authenticated user
   */
  async getAuthUser(): Promise<User> {
    return authenticatedRequest<User>('/auth-user/');
  },

  /**
   * Send password reset code
   */
  async sendPasswordResetCode(email: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/user/send-reset-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Reset password
   */
  async resetPassword(
    email: string,
    code: string | number,
    password: string
  ): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/user/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, password }),
    });
  },
};

/**
 * User API Service
 */
export const userApi = {
  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User> {
    return authenticatedRequest<User>(`/user/${id}`);
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData: {
    name?: string;
    mobile?: string;
    dcc?: string;
    lcb?: string;
  }): Promise<User> {
    return authenticatedRequest<User>('/user/update', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Get user dashboard
   */
  async getDashboard(): Promise<{
    currentTopic: any;
    userParticipation: {
      read_topics: number;
      percentage: number;
      current_week: number;
    };
  }> {
    return authenticatedRequest('/user/dashboard');
  },

  /**
   * Mark user has latest update
   */
  async markHasLatestUpdate(id: number): Promise<User> {
    return authenticatedRequest<User>(`/user/${id}/has-latest-update/`, {
      method: 'POST',
    });
  },
};

