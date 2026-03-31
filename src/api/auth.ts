/**
 * Centralized Authentication API service
 */

import type { LoginPayload, RegisterPayload, AuthResponse } from '../types/user';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const authApi = {
  /**
   * Submit login credentials and retrieve user data/session token
   */
  async login(credentials: LoginPayload): Promise<AuthResponse> {
    console.log(`📡 Calling: POST ${API_BASE_URL}/auth/login`);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Login successful");
    return data;
  },

  /**
   * Register a new user account profile
   */
  async register(data: RegisterPayload): Promise<AuthResponse> {
    console.log(`📡 Calling: POST ${API_BASE_URL}/auth/register`);

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registration encountered an error");
    }

    console.log("✅ Registration successful");
    return result;
  }
};
