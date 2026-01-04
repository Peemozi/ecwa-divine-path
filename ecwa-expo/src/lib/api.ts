/**
 * API Configuration and Service for React Native
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Toggle real API calls
const USE_API = true;

// Try to derive the LAN host Expo is serving from, so "localhost" works on devices.
const getLanHost = () => {
  // Method 1: Get from Expo's hostUri (works when connected via Expo Go)
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const withoutScheme = hostUri.replace(/^(exp|http|https):\/\//, '');
    const host = withoutScheme.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return host;
    }
  }
  
  // Method 2: Check if there's a manual IP override in environment
  const manualIp = process.env.EXPO_PUBLIC_API_IP;
  if (manualIp) {
    return manualIp;
  }
  
  return null;
};

// Get API base URL from environment or use default
// Priority: EXPO_PUBLIC_API_BASE_URL > app.json extra.apiBaseUrl > default
// For mobile devices, replace localhost with your LAN IP if possible.
const RAW_API_BASE_URL = 
  (process.env.EXPO_PUBLIC_API_BASE_URL as string) ||
  (Constants.expoConfig?.extra?.apiBaseUrl as string) || 
  'http://localhost:8000/api';

const derivedHost = getLanHost();
const API_BASE_URL =
  derivedHost && RAW_API_BASE_URL.includes('localhost')
    ? RAW_API_BASE_URL.replace('localhost', derivedHost)
    : RAW_API_BASE_URL;


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
 * Token response from authentication endpoints
 */
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

/**
 * Get access token from AsyncStorage
 */
export const getAccessToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('accessToken');
};

/**
 * Get refresh token from AsyncStorage
 */
export const getRefreshToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('refreshToken');
};

/**
 * Set access token and refresh token in AsyncStorage
 * Also updates lastActivity timestamp to track user activity
 */
export const setTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  const now = Date.now().toString();
  await AsyncStorage.multiSet([
    ['accessToken', accessToken],
    ['refreshToken', refreshToken],
    ['lastActivity', now],
  ]);
};

/**
 * Remove tokens from AsyncStorage
 */
export const removeTokens = async (): Promise<void> => {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'lastActivity']);
};

/**
 * Update last activity timestamp
 */
export const updateLastActivity = async (): Promise<void> => {
  try {
    const now = Date.now().toString();
    await AsyncStorage.setItem('lastActivity', now);
  } catch (error) {
    // Ignore storage errors
  }
};

/**
 * Check if user has been inactive for more than 30 days
 */
export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const lastActivityStr = await AsyncStorage.getItem('lastActivity');
    if (!lastActivityStr) {
      return true; // No activity recorded, consider expired
    }
    
    const lastActivity = parseInt(lastActivityStr, 10);
    if (isNaN(lastActivity)) {
      return true; // Invalid timestamp, consider expired
    }
    
    const now = Date.now();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const daysSinceActivity = (now - lastActivity) / (24 * 60 * 60 * 1000);
    
    return daysSinceActivity > 30;
  } catch (error) {
    return true; // On error, consider expired
  }
};

/**
 * Legacy function for backward compatibility - gets access token
 * @deprecated Use getAccessToken instead
 */
export const getApiToken = async (): Promise<string | null> => {
  return getAccessToken();
};

/**
 * Legacy function for backward compatibility - stores access token
 * @deprecated Use setTokens instead
 */
export const setApiToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem('accessToken', token);
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use removeTokens instead
 */
export const removeApiToken = async (): Promise<void> => {
  await removeTokens();
};

/**
 * Make API request with error handling
 * TEMPORARILY DISABLED: Returns mock error when USE_API is false
 */
export type ApiError = Error & { code?: string; status?: number };

const buildApiError = (message: string, code?: string, status?: number): ApiError => {
  const err = new Error(message) as ApiError;
  if (code) err.code = code;
  if (status) err.status = status;
  return err;
};

export const isSubscriptionError = (error: unknown) => {
  const code = (error as ApiError)?.code;
  return code === 'SUBSCRIPTION_REQUIRED' || code === 'FORBIDDEN';
};

// Track if we're currently refreshing the token to prevent multiple refresh calls
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        // Refresh token is invalid or expired
        await removeTokens();
        return null;
      }

      const data = await response.json();
      if (data.access_token && data.refresh_token) {
        await setTokens(data.access_token, data.refresh_token);
        return data.access_token;
      }

      return null;
    } catch (error) {
      await removeTokens();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryOn401: boolean = true
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Build headers properly
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Merge with provided headers
  const mergedHeaders = {
    ...defaultHeaders,
    ...(options.headers as Record<string, string>),
  };
  
  const config: RequestInit = {
    ...options,
    method: options.method || 'GET',
    // Override headers after spreading options to ensure our headers take precedence
    headers: mergedHeaders,
  };

  try {
    let response: Response;
    try {
      response = await fetch(url, config);
    } catch (fetchError) {
      throw fetchError;
    }
    
    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && retryOn401 && !endpoint.includes('/auth/refresh')) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // Retry the original request with new token
          // Update the Authorization header if present
          const updatedHeaders = {
            ...mergedHeaders,
          };
          
          // If this was an authenticated request, update the token
          if (mergedHeaders['Authorization']) {
            updatedHeaders['Authorization'] = `Bearer ${newAccessToken}`;
          } else if (mergedHeaders['apiToken']) {
            updatedHeaders['apiToken'] = newAccessToken;
          }

          const retryConfig: RequestInit = {
            ...config,
            headers: updatedHeaders,
          };

          const retryResponse = await fetch(url, retryConfig);
          if (!retryResponse.ok) {
            // Still failed after refresh - parse error
            let errorMessage = 'Request failed';
            let errorCode: string | undefined;
            try {
              const errorData = await retryResponse.json();
              if (Array.isArray(errorData)) {
                errorMessage = errorData[0] || 'An error occurred';
              } else if (errorData.message) {
                errorMessage = errorData.message;
              } else if (errorData.error) {
                errorMessage = typeof errorData.error === 'string' ? errorData.error : errorData.error[0] || 'An error occurred';
              }
              if (errorData?.code) {
                errorCode = errorData.code;
              }
            } catch (parseError) {
              errorMessage = retryResponse.statusText || `Server error (${retryResponse.status})`;
            }
            throw buildApiError(errorMessage, errorCode, retryResponse.status);
          }

          // Success after retry - parse and return
          try {
            const retryData = await retryResponse.json();
            return retryData;
          } catch (parseError) {
            throw new Error('Invalid response from server');
          }
        } else {
          // Refresh failed - tokens are invalid
          throw buildApiError('Session expired. Please log in again.', 'UNAUTHORIZED', 401);
        }
      }

      // Other errors or not retrying - parse error normally
      let errorMessage = 'Request failed';
      let errorCode: string | undefined;
      try {
        const data = await response.json();
        if (Array.isArray(data)) {
          errorMessage = data[0] || 'An error occurred';
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = typeof data.error === 'string' ? data.error : data.error[0] || 'An error occurred';
        }
        if (data?.code) {
          errorCode = data.code;
        }
      } catch (parseError) {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || `Server error (${response.status})`;
      }
      
      throw buildApiError(errorMessage, errorCode, response.status);
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
      const helpfulMessage = `Network request failed. 
      
Troubleshooting:
1. Ensure your API server is running on port 8000
2. Check the API URL: ${API_BASE_URL}
3. For mobile devices, verify your computer's IP address
4. Test in browser: ${API_BASE_URL.replace('/api', '')}
5. Check console logs for detected IP address

Current API URL: ${API_BASE_URL}`;
      
      console.error('[API] Network request failed:', {
        url,
        apiBaseUrl: API_BASE_URL,
        rawApiBaseUrl: RAW_API_BASE_URL,
        detectedHost: derivedHost || 'none',
        error: error instanceof Error ? error.message : String(error)
      });
      
      throw buildApiError(helpfulMessage);
    }
    if (error instanceof Error) {
      const apiErr = error as ApiError;
      if (!apiErr.status) apiErr.status = undefined;
      console.error('[API] Request error:', {
        url,
        message: apiErr.message,
        code: apiErr.code,
        status: apiErr.status
      });
      throw apiErr;
    }
    throw buildApiError('Network error occurred');
  }
}

/**
 * Make authenticated API request
 * Updates lastActivity timestamp on successful request
 */
async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!USE_API) {
    throw new Error('API is temporarily disabled. Backend configuration is being updated.');
  }

  const accessToken = await getAccessToken();
  
  if (!accessToken) {
    throw new Error('No authentication token found');
  }

  const result = await apiRequest<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      // Keep apiToken for backward compatibility if backend still needs it
      apiToken: accessToken,
    },
  }, true); // Enable 401 retry with refresh
  
  // Update last activity on successful authenticated request
  await updateLastActivity();
  
  return result;
}

/**
 * Authentication API Service
 */
export const authApi = {
  /**
   * Send login code to email
   */
  async sendLoginCode(email: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/auth/send-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Verify login code
   */
  async verifyLoginCode(email: string, code: string): Promise<TokenResponse> {
    return apiRequest<TokenResponse>('/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }, false);
  },

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<TokenResponse> {
    return apiRequest<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false);
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
  }): Promise<TokenResponse> {
    return apiRequest<TokenResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false);
  },

  /**
   * Refresh access token
   */
  async refresh(refreshToken: string): Promise<TokenResponse> {
    return apiRequest<TokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }, false);
  },

  /**
   * Get authenticated user
   */
  async getAuthUser(): Promise<User> {
    return authenticatedRequest<User>('/auth/me');
  },

  /**
   * Logout user (revokes api_token)
   */
  async logout(): Promise<{ message: string }> {
    return authenticatedRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },

  /**
   * Send password reset code
   */
  async sendPasswordResetCode(email: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/auth/forgot-password', {
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
    return apiRequest<{ message: string }>('/auth/reset-password', {
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

/**
 * Hymn API Service
 */
export const hymnApi = {
  /**
   * List hymns (optional language, search, pagination)
   */
  async listHymns(params?: { language?: string; page?: number; search?: string }): Promise<any[]> {
    const language = params?.language;
    const qs = new URLSearchParams();
    if (params?.page) qs.append('page', String(params.page));
    if (params?.search) qs.append('search', params.search);
    if (language) qs.append('language', language); // Add language as query param instead of path
    const query = qs.toString() ? `?${qs.toString()}` : '';
    // Always use /hymns/all endpoint, filter by language query param
    const path = `/hymns/all${query}`;
    const data = await authenticatedRequest<any[]>(path);
    return data;
  },

  /**
   * Get hymn detail
   */
  async getHymn(id: number | string): Promise<any> {
    return authenticatedRequest<any>(`/portal/hymns/get/${id}`);
  },
};

/**
 * Manuals / Lessons API Service
 * For Sunday School: Uses /api/sunday-school/all endpoint
 * Response structure: Array of manual objects with { id, name, year, language, topics[] }
 */
export const manualApi = {
  async getTypes(): Promise<string[]> {
    return authenticatedRequest<string[]>('/manuals/types');
  },
  async getYears(type: string): Promise<number[]> {
    // For Sunday School, use the /sunday-school/all endpoint
    if (type === 'sunday-school') {
      try {
        const response = await authenticatedRequest<any>('/sunday-school/all');
        
        // Handle different response structures
        let data: any[] = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response && typeof response === 'object') {
          // Check for nested data structures
          if (Array.isArray(response.data)) {
            data = response.data;
          } else if (Array.isArray(response.years)) {
            // If years are already extracted
            const years = response.years.map((y: any) => {
              if (typeof y === 'number') return y;
              const num = parseInt(String(y), 10);
              return isNaN(num) ? null : num;
            }).filter((y: any) => y != null) as number[];
            return years.sort((a: number, b: number) => b - a);
          } else if (response.data && Array.isArray(response.data)) {
            data = response.data;
          }
        }
        
        if (!data || !Array.isArray(data) || data.length === 0) {
          return [];
        }
        
        // Extract unique years from the response
        // Handle both number and string years (convert strings to numbers)
        const years = [...new Set(
          data
            .map((item: any) => {
              // Try different possible field names for year
              const year = item.year || item.Year || item.YEAR || item.year_id || item.yearId;
              
              // Handle number
              if (typeof year === 'number' && !isNaN(year)) {
                return year;
              }
              // Handle string that can be converted to number
              if (typeof year === 'string') {
                const numYear = parseInt(year, 10);
                if (!isNaN(numYear) && numYear > 0) {
                  return numYear;
                }
              }
              return null;
            })
            .filter((y: any): y is number => y != null)
        )]
          .sort((a: number, b: number) => b - a); // Sort descending (newest first)
        
        return years;
      } catch (error) {
        throw error;
      }
    }
    
    // For other types, try the standard endpoint
    try {
      return await authenticatedRequest<number[]>(`/manuals/${type}/years`);
    } catch (error) {
      throw error;
    }
  },
  async getLanguages(type: string, year: string | number): Promise<string[]> {
    // For Sunday School, use the /sunday-school/all endpoint
    if (type === 'sunday-school') {
      try {
        const data = await authenticatedRequest<any[]>('/sunday-school/all');
        // Extract unique languages for the given year
        if (data && Array.isArray(data)) {
          const languages = [...new Set(
            data
              .filter((item: any) => item.year == year)
              .map((item: any) => item.language)
              .filter((l: any) => l != null && typeof l === 'string')
          )];
          return languages;
        }
        return [];
      } catch (error) {
        console.error('[manualApi.getLanguages] Error fetching from /sunday-school/all:', error);
        throw error;
      }
    }
    
    // For other types, try the standard endpoint
    try {
      return await authenticatedRequest<string[]>(`/manuals/${type}/${year}/languages`);
    } catch (error) {
      throw error;
    }
  },
  async getLessons(type: string, year: string | number, language: string): Promise<any[]> {
    // For Sunday School, use the /sunday-school/all endpoint
    if (type === 'sunday-school') {
      try {
        const data = await authenticatedRequest<any[]>('/sunday-school/all');
        // Find the manual matching year and language, then return its topics as lessons
        if (data && Array.isArray(data)) {
          // Normalize year and language for comparison (same as getLessonDetail)
          const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
          const langLower = (language || '').toLowerCase();
          
          const manual = data.find((item: any) => {
            const itemYear = typeof item.year === 'string' ? parseInt(item.year, 10) : item.year;
            const yearMatch = itemYear == yearNum;
            const langMatch = ((item.language || '').toLowerCase()) === langLower;
            return yearMatch && langMatch;
          });
          
          if (manual && manual.topics && Array.isArray(manual.topics)) {
            // Map topics to lessons format, including the topic field
            const lessons = manual.topics.map((topic: any) => ({
              id: topic.id,
              number: topic.number,
              title: topic.topic || `Lesson ${topic.number}`, // Use topic as title
              topic: topic.topic, // Include topic field
              ...topic, // Include all other fields
            }));
            return lessons;
          }
          return [];
        }
        return [];
      } catch (error) {
        console.error('[manualApi.getLessons] Error fetching from /sunday-school/all:', error);
        throw error;
      }
    }
    
    // For other types, try the standard endpoint
    try {
      return await authenticatedRequest<any[]>(`/manuals/${type}/${year}/${language}/lessons`);
    } catch (error) {
      throw error;
    }
  },
  async getLessonDetail(type: string, year: string | number, language: string, lessonId: string | number): Promise<any> {
    // For Sunday School, get from /sunday-school/all and find the specific topic
    if (type === 'sunday-school') {
      try {
        const data = await authenticatedRequest<any[]>('/sunday-school/all');
        
        if (data && Array.isArray(data)) {
          // Normalize year and lessonId for comparison
          const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
          const lessonIdNum = typeof lessonId === 'string' ? parseInt(lessonId, 10) : lessonId;
          
          const manual = data.find((item: any) => {
            const itemYear = typeof item.year === 'string' ? parseInt(item.year, 10) : item.year;
            const yearMatch = itemYear == yearNum;
            const langMatch = (item.language || '').toLowerCase() === (language || '').toLowerCase();
            return yearMatch && langMatch;
          });
          
          // Try to get topics from various possible field names
          const topics = manual?.topics || manual?.lessons || manual?.items || [];
          
          if (manual && Array.isArray(topics) && topics.length > 0) {
            // Try to find topic by number first (more reliable), then by id
            const topic = topics.find((t: any) => {
              const tNumber = typeof t.number === 'string' ? parseInt(t.number, 10) : t.number;
              const tId = typeof t.id === 'string' ? parseInt(t.id, 10) : t.id;
              return tNumber == lessonIdNum || tId == lessonIdNum;
            });
            
            if (topic) {
              // Return all topic fields, ensuring proper field mapping
              return {
                id: topic.id,
                number: topic.number,
                topic: topic.topic,
                title: topic.topic, // Alias for compatibility
                bible_text: topic.bible_text,
                texts: topic.bible_text, // Alias for compatibility
                aim: topic.aim,
                objective: topic.aim, // Alias for compatibility
                introduction: topic.introduction,
                intro: topic.introduction, // Alias for compatibility
                content: topic.content,
                conclusion: topic.conclusion,
                application: topic.conclusion, // Alias for compatibility
                memory_verse: topic.memory_verse,
                memoryVerse: topic.memory_verse, // Alias for compatibility
                sections: topic.sections, // Include if available
                // Include all other fields from topic
                ...topic,
                // Include manual metadata
                manualId: manual.id,
                manualName: manual.name,
                year: manual.year,
                language: manual.language,
              };
            }
          }
        }
        throw new Error(`Lesson ${lessonId} not found in ${year} ${language} manual`);
      } catch (error) {
        console.error('[manualApi.getLessonDetail] Error fetching lesson detail:', error);
        throw error;
      }
    }
    
    // For other types, use the standard endpoint
    return authenticatedRequest<any>(`/manuals/${type}/${year}/${language}/lessons/${lessonId}`);
  },
};

