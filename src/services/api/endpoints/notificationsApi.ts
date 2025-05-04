
import api, { handleResponse } from '../index';

// Notifications endpoints
export const notificationsApi = {
  getNotifications: (page = 1, limit = 10) => 
    handleResponse(api.get(`/notifications?page=${page}&limit=${limit}`)),
  
  markAsRead: (notificationId: string) => 
    handleResponse(api.put(`/notifications/${notificationId}/read`)),
  
  markAllAsRead: () => 
    handleResponse(api.put('/notifications/read-all')),
  
  deleteNotification: (notificationId: string) => 
    handleResponse(api.delete(`/notifications/${notificationId}`)),
  
  getNotificationSettings: () => 
    handleResponse(api.get('/notifications/settings')),
  
  updateNotificationSettings: (settings: any) => 
    handleResponse(api.put('/notifications/settings', settings)),
  
  createAdminNotification: (data: any) => 
    handleResponse(api.post('/admin/notifications', data)),
};
