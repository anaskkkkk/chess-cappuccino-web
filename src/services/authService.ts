
import api from './api';
import { toast } from 'sonner';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  rating?: number;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // TODO: Replace with actual API implementation
      const response = await Promise.resolve({
        data: {
          user: {
            id: '1',
            name: 'Test User',
            email: credentials.email,
            avatarUrl: '',
            rating: 1200,
            createdAt: new Date().toISOString(),
          },
          token: 'mock_jwt_token'
        }
      });
      
      // Store the token
      localStorage.setItem('auth_token', response.data.token);
      
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login. Please check your credentials.');
    }
  }

  async signup(userData: SignupData): Promise<User> {
    try {
      // TODO: Replace with actual API implementation
      const response = await Promise.resolve({
        data: {
          user: {
            id: '1',
            name: userData.name,
            email: userData.email,
            avatarUrl: '',
            rating: 1200,
            createdAt: new Date().toISOString(),
          },
          token: 'mock_jwt_token'
        }
      });
      
      // Store the token
      localStorage.setItem('auth_token', response.data.token);
      
      return response.data.user;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Failed to create account. Please try again.');
    }
  }

  async logout(): Promise<void> {
    try {
      // TODO: Replace with actual API implementation
      await Promise.resolve();
      
      // Clear stored token
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
      // Still remove the token even if API call fails
      localStorage.removeItem('auth_token');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      
      // TODO: Replace with actual API implementation
      const response = await Promise.resolve({
        data: {
          user: {
            id: '1',
            name: 'Test User',
            email: 'user@example.com',
            avatarUrl: '',
            rating: 1200,
            createdAt: new Date().toISOString(),
          }
        }
      });
      
      return response.data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      localStorage.removeItem('auth_token');
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}

export default new AuthService();
