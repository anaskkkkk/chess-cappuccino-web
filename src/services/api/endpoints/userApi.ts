
import api, { handleResponse } from '../index';

// User related endpoints
export const userApi = {
  login: (email: string, password: string) => 
    handleResponse(api.post('/auth/login', { email, password })),
  
  register: (userData: any) => 
    handleResponse(api.post('/auth/register', userData)),
  
  logout: () => 
    handleResponse(api.post('/auth/logout')),
  
  forgotPassword: (email: string) => 
    handleResponse(api.post('/auth/forgot-password', { email })),
  
  resetPassword: (token: string, password: string) => 
    handleResponse(api.post(`/auth/reset-password/${token}`, { password })),
  
  getCurrentUser: () => 
    handleResponse(api.get('/users/me')),
  
  updateProfile: (userId: string, data: any) => 
    handleResponse(api.put(`/users/${userId}`, data)),
  
  getAllUsers: (page = 1, limit = 10, search = '') => 
    handleResponse(api.get(`/users?page=${page}&limit=${limit}&search=${search}`)),
  
  getUserById: (userId: string) => 
    handleResponse(api.get(`/users/${userId}`)),
  
  deleteUser: (userId: string) => 
    handleResponse(api.delete(`/users/${userId}`)),
  
  updateUserRole: (userId: string, role: string) => 
    handleResponse(api.put(`/users/${userId}/role`, { role })),
};
