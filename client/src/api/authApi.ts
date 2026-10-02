import { apiClient, fetchWithMockFallback } from './client';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';

export interface AuthResponseData {
  token: string;
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponseData> => {
    return fetchWithMockFallback(
      () => apiClient.post('/auth/login', credentials),
      () => {
        if (!credentials.email || !credentials.password) {
          throw new Error('Email and password are required');
        }
        return {
          token: `mock-jwt-token-${Date.now()}`,
          _id: 'usr-customer-1',
          name: credentials.email.split('@')[0].replace('.', ' '),
          email: credentials.email,
          role: credentials.email.includes('admin') ? 'admin' : 'customer',
        };
      }
    );
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponseData> => {
    return fetchWithMockFallback(
      () => apiClient.post('/auth/register', credentials),
      () => {
        if (!credentials.name || !credentials.email || !credentials.password) {
          throw new Error('All registration fields are required');
        }
        return {
          token: `mock-jwt-token-${Date.now()}`,
          _id: `usr-${Date.now()}`,
          name: credentials.name,
          email: credentials.email,
          role: 'customer',
        };
      }
    );
  },
};
