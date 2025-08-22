// API Service for Backend Integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  full_name: string;
  role: 'FoodProvider' | 'NGO/Volunteer' | 'Individual' | 'Admin';
  organization?: string;
  phone?: string;
  address?: string;
}

export interface ApiUser {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: string;
  organization: string | null;
  phone: string | null;
  address: string | null;
  is_email_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: ApiUser;
  access: string;
  refresh: string;
  message: string;
}

export interface FoodListingRequest {
  title: string;
  description: string;
  quantity: number;
  location: string;
  expiry_time: string;
}

export interface ApiFoodListing {
  id: number;
  title: string;
  description: string;
  quantity: number;
  location: string;
  expiry_time: string;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

// Token Management
class TokenManager {
  private static ACCESS_TOKEN_KEY = 'access_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';
  private static USER_KEY = 'user_data';

  static setTokens(access: string, refresh: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, access);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setUser(user: ApiUser) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): ApiUser | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static clearAll() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// API Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getAccessToken();

    console.log('API Request:', { url, hasToken: !!token, tokenPreview: token?.substring(0, 20) + '...' });

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try refresh
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry with new token
            const newToken = TokenManager.getAccessToken();
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            };
            const retryResponse = await fetch(url, config);
            if (retryResponse.ok) {
              return await retryResponse.json();
            }
            // If retry also fails, it's a real auth issue
            TokenManager.clearAll();
            throw new Error('Authentication failed - please login again');
          } else {
            // Refresh failed, clear tokens but don't redirect automatically
            TokenManager.clearAll();
            throw new Error('Session expired - please login again');
          }
        }

        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);

        // Handle permission denied errors (403)
        if (response.status === 403) {
          if (errorData.detail) {
            throw new Error(errorData.detail);
          }
          throw new Error('Permission denied - you may not have the required role for this action');
        }

        // Handle validation errors
        if (errorData.non_field_errors) {
          throw new Error(errorData.non_field_errors[0]);
        }

        // Handle field-specific errors
        const fieldErrors = [];
        for (const [field, errors] of Object.entries(errorData)) {
          if (Array.isArray(errors)) {
            fieldErrors.push(`${field}: ${errors[0]}`);
          }
        }

        if (fieldErrors.length > 0) {
          throw new Error(fieldErrors.join(', '));
        }

        throw new Error(errorData.message || errorData.detail || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        TokenManager.setTokens(data.access, refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    return false;
  }

  // Auth Methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    TokenManager.setTokens(response.access, response.refresh);
    TokenManager.setUser(response.user);
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    TokenManager.setTokens(response.access, response.refresh);
    TokenManager.setUser(response.user);
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout/', { method: 'POST' });
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      TokenManager.clearAll();
    }
  }

  async getProfile(): Promise<ApiUser> {
    return await this.request<ApiUser>('/auth/profile/');
  }

  // Food Listing Methods
  async getFoodListings(): Promise<ApiFoodListing[]> {
    const response = await this.request<{ results: ApiFoodListing[] }>('/food/');
    return response.results || [];
  }

  async createFoodListing(data: FoodListingRequest): Promise<ApiFoodListing> {
    return await this.request<ApiFoodListing>('/food/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFoodListing(id: number): Promise<ApiFoodListing> {
    return await this.request<ApiFoodListing>(`/food/${id}/`);
  }

  async updateFoodListing(id: number, data: Partial<FoodListingRequest>): Promise<ApiFoodListing> {
    return await this.request<ApiFoodListing>(`/food/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteFoodListing(id: number): Promise<void> {
    await this.request(`/food/${id}/`, { method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
export { TokenManager };
export default apiClient;
