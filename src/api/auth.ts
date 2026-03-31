import { apiClient } from './apiClient';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types/user';

export const authApi = {
  /**
   * Submit login credentials and retrieve user data/session token
   */
  async login(credentials: LoginPayload): Promise<AuthResponse> {
    return apiClient.post('/auth/login', credentials);
  },

  /**
   * Register a new user account profile
   */
  async register(data: RegisterPayload): Promise<AuthResponse> {
    return apiClient.post('/auth/register', data);
  }
};
