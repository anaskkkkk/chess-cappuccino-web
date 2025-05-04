
import api, { handleResponse } from '../index';

// Task management endpoints
export const taskApi = {
  getTasks: (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters as Record<string, string>
    });
    return handleResponse(api.get(`/tasks?${queryParams}`));
  },
  
  getTaskById: (taskId: string) => 
    handleResponse(api.get(`/tasks/${taskId}`)),
  
  createTask: (taskData: any) => 
    handleResponse(api.post('/tasks', taskData)),
  
  updateTask: (taskId: string, taskData: any) => 
    handleResponse(api.put(`/tasks/${taskId}`, taskData)),
  
  deleteTask: (taskId: string) => 
    handleResponse(api.delete(`/tasks/${taskId}`)),
  
  completeTask: (taskId: string) => 
    handleResponse(api.put(`/tasks/${taskId}/complete`)),
  
  assignTask: (taskId: string, userId: string) => 
    handleResponse(api.put(`/tasks/${taskId}/assign/${userId}`)),
  
  getCategories: () => 
    handleResponse(api.get('/tasks/categories')),
  
  createCategory: (categoryData: any) => 
    handleResponse(api.post('/tasks/categories', categoryData)),
};
