/**
 * API Configuration and Service
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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
 * Get API token from localStorage
 */
export const getApiToken = (): string | null => {
  return localStorage.getItem('apiToken');
};

/**
 * Set API token in localStorage
 */
export const setApiToken = (token: string): void => {
  localStorage.setItem('apiToken', token);
};

/**
 * Remove API token from localStorage
 */
export const removeApiToken = (): void => {
  localStorage.removeItem('apiToken');
};

/**
 * Make API request with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
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
    const data = await response.json();

    if (!response.ok) {
      // Handle error responses
      if (Array.isArray(data)) {
        throw new Error(data[0] || 'An error occurred');
      }
      if (data.message) {
        throw new Error(data.message);
      }
      throw new Error('Request failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

/**
 * Make authenticated API request
 */
async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getApiToken();
  
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

