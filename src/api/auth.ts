import { apiClient } from './apiClient';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types/user';

export const authApi = {
  /**
   * Submit login credentials and retrieve user data/session token
   */
  async login(credentials: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    // Directly capture the nested token value
    const token = response?.data?.token;
    
    if (token) {
      console.log("Token received and stored successfully.");
      apiClient.setToken(token);
    } else {
      console.warn("No token found in response body!", response);
    }
    return response;
  },

  /**
   * Register a new user account profile
   */
  async register(data: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data);
    const token = response?.data?.token;

    if (token) {
      apiClient.setToken(token);
    }
    return response;
  }
};
