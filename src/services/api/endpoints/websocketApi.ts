
import api, { handleResponse } from '../index';

// Websocket API endpoints
export const websocketApi = {
  getAuthToken: () => 
    handleResponse(api.get('/websocket/auth')),
  
  getLogs: (filters = {}) => 
    handleResponse(api.post('/websocket/logs', filters)),
  
  subscribeToChannel: (channel: string, authToken: string) => 
    handleResponse(api.post('/websocket/subscribe', { channel, authToken })),
  
  getSystemLogs: (page = 1, limit = 50, filters = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters as Record<string, string>
    });
    return handleResponse(api.get(`/websocket/system-logs?${queryParams}`));
  },
};
