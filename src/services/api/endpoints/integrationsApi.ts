
import api, { handleResponse } from '../index';

// Integrations API endpoints
export const integrationsApi = {
  getAllIntegrations: () => 
    handleResponse(api.get('/integrations')),
  
  getIntegrationById: (integrationId: string) => 
    handleResponse(api.get(`/integrations/${integrationId}`)),
  
  createIntegration: (data: any) => 
    handleResponse(api.post('/integrations', data)),
  
  updateIntegration: (integrationId: string, data: any) => 
    handleResponse(api.put(`/integrations/${integrationId}`, data)),
  
  deleteIntegration: (integrationId: string) => 
    handleResponse(api.delete(`/integrations/${integrationId}`)),
  
  testIntegration: (integrationId: string) => 
    handleResponse(api.post(`/integrations/${integrationId}/test`)),
  
  enableIntegration: (integrationId: string) => 
    handleResponse(api.put(`/integrations/${integrationId}/enable`)),
  
  disableIntegration: (integrationId: string) => 
    handleResponse(api.put(`/integrations/${integrationId}/disable`)),
  
  syncIntegration: (integrationId: string) => 
    handleResponse(api.post(`/integrations/${integrationId}/sync`)),
  
  getIntegrationLogs: (integrationId: string, page = 1, limit = 50) => 
    handleResponse(api.get(`/integrations/${integrationId}/logs?page=${page}&limit=${limit}`)),
  
  getAvailableIntegrations: () => 
    handleResponse(api.get('/integrations/available')),
  
  getIntegrationEvents: (integrationId: string) => 
    handleResponse(api.get(`/integrations/${integrationId}/events`)),
};
