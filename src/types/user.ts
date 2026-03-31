/**
 * Interface for user-related authentication models
 */

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  confirmPassword: string;
}

export interface AuthResponse {
  code: number;
  message: string;
  data: {
    username: string;
    token?: string; 
    // Add additional backend user metadata mapping here if required!
  };
}
