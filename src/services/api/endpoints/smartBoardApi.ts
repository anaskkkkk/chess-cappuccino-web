
import api, { handleResponse } from '../index';

// SmartBoard related endpoints
export const smartBoardApi = {
  getAllBoards: (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters as Record<string, string>
    });
    return handleResponse(api.get(`/smartboards?${queryParams}`));
  },
  
  getBoardById: (boardId: string) => 
    handleResponse(api.get(`/smartboards/${boardId}`)),
  
  pairBoard: (boardId: string, userId: string) => 
    handleResponse(api.post('/smartboards/pair', { boardId, userId })),
  
  unpairBoard: (boardId: string) => 
    handleResponse(api.post(`/smartboards/${boardId}/unpair`)),
  
  getBoardStatus: (boardId: string) => 
    handleResponse(api.get(`/smartboards/${boardId}/status`)),
  
  updateBoardSettings: (boardId: string, settings: any) => 
    handleResponse(api.put(`/smartboards/${boardId}/settings`, settings)),
  
  sendOTAUpdate: (boardId: string, version: string) => 
    handleResponse(api.post(`/smartboards/${boardId}/ota`, { version })),
  
  sendBatchOTAUpdate: (boardIds: string[], version: string) => 
    handleResponse(api.post('/smartboards/batch-ota', { boardIds, version })),
  
  getBoardLogs: (boardId: string, limit = 100) => 
    handleResponse(api.get(`/smartboards/${boardId}/logs?limit=${limit}`)),
  
  // These are the new methods for QR code scanning functionality
  validateScannedCode: (qrCode: string) => 
    handleResponse(api.post('/smartboards/validate-qr', { qrCode })),
  
  pairBoardByQrCode: (qrCode: string, userId: string) => 
    handleResponse(api.post('/smartboards/pair-by-qr', { qrCode, userId })),
};
