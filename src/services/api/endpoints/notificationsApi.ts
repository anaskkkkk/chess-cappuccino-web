
import api, { handleResponse } from '../index';

// Notification interface to be used by the API
export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'game' | 'tournament' | 'marketing' | 'all';
  createdAt: string;
  read: boolean;
}

// Notification settings interface
export interface NotificationSettings {
  emailEnabled: boolean;
  emailGameInvites: boolean;
  emailTournamentUpdates: boolean;
  emailSystemAnnouncements: boolean;
  emailMarketingEmails: boolean;
  pushEnabled: boolean;
  pushYourTurn: boolean;
  pushFriendActivity: boolean;
  pushSystemAnnouncements: boolean;
  inAppEnabled: boolean;
  inAppGameInvites: boolean;
  inAppTournamentUpdates: boolean;
  inAppSystemAnnouncements: boolean;
}

// New notification interface
export interface NewNotification {
  title: string;
  content: string;
  type: 'system' | 'game' | 'tournament' | 'marketing';
  target: 'all' | 'players' | 'admins' | 'premium';
}

// Interface for filters
export interface NotificationFilters {
  read?: boolean;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Notifications API endpoints
export const notificationsApi = {
  // Get all notifications with optional filters
  getNotifications: (filters: NotificationFilters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.read !== undefined) {
      queryParams.append('read', String(filters.read));
    }
    
    if (filters.type) {
      queryParams.append('type', filters.type);
    }
    
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    
    if (filters.page) {
      queryParams.append('page', String(filters.page));
    }
    
    if (filters.limit) {
      queryParams.append('limit', String(filters.limit));
    }
    
    const query = queryParams.toString() ? `?${queryParams}` : '';
    return handleResponse(api.get(`/notifications${query}`));
  },
  
  // Get a specific notification by ID
  getNotificationById: (id: string) => 
    handleResponse(api.get(`/notifications/${id}`)),
  
  // Mark a notification as read
  markNotificationAsRead: (id: string) => 
    handleResponse(api.put(`/notifications/${id}/read`)),
  
  // Mark all notifications as read
  markAllNotificationsAsRead: () => 
    handleResponse(api.put('/notifications/read-all')),
  
  // Delete a notification
  deleteNotification: (id: string) => 
    handleResponse(api.delete(`/notifications/${id}`)),
  
  // Get notification settings
  getNotificationSettings: () => 
    handleResponse(api.get('/notifications/settings')),
  
  // Update notification settings
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => 
    handleResponse(api.put('/notifications/settings', settings)),
  
  // Send a new notification
  sendNotification: (notification: NewNotification) => 
    handleResponse(api.post('/notifications', notification)),
    
  // Get unread notification count
  getUnreadCount: () => 
    handleResponse(api.get('/notifications/unread-count')),
    
  // Subscribe to user notifications
  subscribeToNotifications: (userId: string, token: string) => 
    handleResponse(api.post('/notifications/subscribe', { userId, token })),
    
  // Unsubscribe from notifications
  unsubscribeFromNotifications: (token: string) => 
    handleResponse(api.post('/notifications/unsubscribe', { token }))
};
