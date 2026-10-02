import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, RegisterCredentials } from '../../../types/auth';
import { authApi } from '../../../api/authApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login(credentials);
          const user: User = {
            _id: res._id,
            name: res.name,
            email: res.email,
            role: res.role,
          };
          localStorage.setItem('mini_ecom_token', res.token);
          set({
            user,
            token: res.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.message || 'Login failed. Please check your credentials.',
          });
          return false;
        }
      },

      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.register(credentials);
          const user: User = {
            _id: res._id,
            name: res.name,
            email: res.email,
            role: res.role,
          };
          localStorage.setItem('mini_ecom_token', res.token);
          set({
            user,
            token: res.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.message || 'Registration failed. Please try again.',
          });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('mini_ecom_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mini_ecom_auth_store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
