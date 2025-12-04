const API_BASE_URL = 'https://api.example.com'; // TODO: Replace with actual API URL

const getToken = (): string | null => {
  return localStorage.getItem('apiToken');
};

const setToken = (token: string): void => {
  localStorage.setItem('apiToken', token);
};

const removeToken = (): void => {
  localStorage.removeItem('apiToken');
};

const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { apiToken: token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  language: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  api_token: string;
  user?: {
    id: number;
    name: string;
    email: string;
    language: string;
  };
  message?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  language: string;
}

// POST /api/user/create
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/user/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Registration failed');
  }
  
  if (result.api_token) {
    setToken(result.api_token);
  }
  
  return result;
};

// POST /api/user/login
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Wrong Username or Password');
  }
  
  if (result.api_token) {
    setToken(result.api_token);
  }
  
  return result;
};

// POST /api/user/login/send-code
export const sendLoginCode = async (email: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/user/login/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to send code');
  }
  
  return result;
};

// POST /api/user/login/verify
export const verifyLoginCode = async (email: string, code: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/user/login/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Wrong Code');
  }
  
  if (result.api_token) {
    setToken(result.api_token);
  }
  
  return result;
};

// POST /api/user/send-reset-code
export const sendResetCode = async (email: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/user/send-reset-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to send reset code');
  }
  
  return result;
};

// POST /api/user/reset-password
export const resetPassword = async (email: string, code: string, password: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/user/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, password }),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to reset password');
  }
  
  return result;
};

// GET /api/auth-user/
export const getAuthUser = async (): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/auth-user/`, {
    method: 'GET',
    headers: authHeaders(),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    removeToken();
    throw new Error(result.message || 'Unauthorized');
  }
  
  return result;
};

// PUT /api/auth-user/update (example for profile update)
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/auth-user/update`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to update profile');
  }
  
  return result;
};

export const logout = (): void => {
  removeToken();
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export { getToken, setToken, removeToken };
