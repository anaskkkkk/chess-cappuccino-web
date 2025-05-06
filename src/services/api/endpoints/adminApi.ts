
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
  
  // Backup and Restore endpoints
  createBackup: () => 
    handleResponse(api.post('/admin/backup')),
  
  restoreBackup: (backupId: string) => 
    handleResponse(api.post(`/admin/restore/${backupId}`)),
  
  getBackups: () => 
    handleResponse(api.get('/admin/backups')),
  
  deleteBackup: (backupId: string) => 
    handleResponse(api.delete(`/admin/backups/${backupId}`)),
  
  downloadBackup: (backupId: string) => 
    handleResponse(api.get(`/admin/backups/${backupId}/download`)),
  
  updateBackupConfig: (config: any) => 
    handleResponse(api.put('/admin/backup-config', config)),
    
  // Feature Flag endpoints
  getFeatureFlags: () => 
    handleResponse(api.get('/admin/feature-flags')),
  
  updateFeatureFlag: (flagId: string, enabled: boolean) => 
    handleResponse(api.put(`/admin/feature-flags/${flagId}`, { enabled })),
  
  createFeatureFlag: (flagData: any) => 
    handleResponse(api.post('/admin/feature-flags', flagData)),
  
  deleteFeatureFlag: (flagId: string) => 
    handleResponse(api.delete(`/admin/feature-flags/${flagId}`)),
  
  // Help and Support endpoints
  getKnowledgeBaseArticles: (category = 'all', page = 1, limit = 20) => 
    handleResponse(api.get(`/admin/knowledge-base?category=${category}&page=${page}&limit=${limit}`)),
  
  getFaqs: () => 
    handleResponse(api.get('/admin/faqs')),
  
  submitSupportRequest: (data: any) => 
    handleResponse(api.post('/admin/support-requests', data)),
};
