
import api, { handleResponse } from '../index';

// Admin related endpoints
export const adminApi = {
  getDashboardStats: () => 
    handleResponse(api.get('/admin/stats')),
  
  getSystemHealth: () => 
    handleResponse(api.get('/admin/system-health')),
  
  getAuditLogs: (page = 1, limit = 50, filters = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters as Record<string, string>
    });
    return handleResponse(api.get(`/admin/audit-logs?${queryParams}`));
  },
  
  getNotifications: (page = 1, limit = 10) => 
    handleResponse(api.get(`/admin/notifications?page=${page}&limit=${limit}`)),
  
  createNotification: (data: any) => 
    handleResponse(api.post('/admin/notifications', data)),
  
  createBackup: () => 
    handleResponse(api.post('/admin/backup')),
  
  restoreBackup: (backupId: string) => 
    handleResponse(api.post(`/admin/restore/${backupId}`)),
  
  getBackups: () => 
    handleResponse(api.get('/admin/backups')),
  
  getFeatureFlags: () => 
    handleResponse(api.get('/admin/feature-flags')),
  
  updateFeatureFlag: (flagId: string, enabled: boolean) => 
    handleResponse(api.put(`/admin/feature-flags/${flagId}`, { enabled })),
};
