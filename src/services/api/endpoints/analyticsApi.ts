
import api, { handleResponse } from '../index';

// Analytics endpoints
export const analyticsApi = {
  getGameAnalytics: (period: string = 'month') => 
    handleResponse(api.get(`/analytics/games?period=${period}`)),
  
  getUserAnalytics: (period: string = 'month') => 
    handleResponse(api.get(`/analytics/users?period=${period}`)),
  
  getStoreAnalytics: (period: string = 'month') => 
    handleResponse(api.get(`/analytics/store?period=${period}`)),
  
  getLearningAnalytics: (period: string = 'month') => 
    handleResponse(api.get(`/analytics/learning?period=${period}`)),
  
  getCustomReport: (params: any) => 
    handleResponse(api.post('/analytics/custom-report', params)),
  
  exportAnalytics: (type: string, period: string, format: 'csv' | 'pdf') => 
    handleResponse(api.get(`/analytics/export/${type}?period=${period}&format=${format}`, {
      responseType: 'blob'
    })),
};
