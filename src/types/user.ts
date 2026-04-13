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
    id?: number;
    username: string;
    token?: string;
    role?: string;
  };
}
