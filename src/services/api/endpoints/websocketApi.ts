
import api, { handleResponse } from '../index';

// Websocket API endpoints
export const websocketApi = {
  getAuthToken: () => 
    handleResponse(api.get('/websocket/auth')),
};
