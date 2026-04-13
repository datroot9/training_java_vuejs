/**
 * Centralized API Client
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = {
  getHeaders(isBlob: boolean = false): HeadersInit {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (!isBlob) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  },

  setToken(token: string) {
    localStorage.setItem('token', token);
  },

  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  },

  async post(endpoint: string, body: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body)
    });
    return this.handleResponse(response);
  },

  async put(endpoint: string, body: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body)
    });
    return this.handleResponse(response);
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  },

  async handleResponse(response: Response) {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const msg = data?.message as string | undefined;
      const fieldErrors = data?.data;
      let error = msg;
      if (
        !error &&
        fieldErrors &&
        typeof fieldErrors === 'object' &&
        !Array.isArray(fieldErrors)
      ) {
        error = Object.entries(fieldErrors as Record<string, string>)
          .map(([k, v]) => `${k}: ${v}`)
          .join('; ');
      }
      if (!error) {
        error = response.statusText;
      }
      throw new Error(error);
    }

    return data;
  }
};
