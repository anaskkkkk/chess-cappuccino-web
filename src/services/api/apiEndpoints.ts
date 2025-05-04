import api, { handleResponse } from './index';

// User related endpoints
export const userApi = {
  login: (email: string, password: string) => 
    handleResponse(api.post('/auth/login', { email, password })),
  
  register: (userData: any) => 
    handleResponse(api.post('/auth/register', userData)),
  
  logout: () => 
    handleResponse(api.post('/auth/logout')),
  
  forgotPassword: (email: string) => 
    handleResponse(api.post('/auth/forgot-password', { email })),
  
  resetPassword: (token: string, password: string) => 
    handleResponse(api.post(`/auth/reset-password/${token}`, { password })),
  
  getCurrentUser: () => 
    handleResponse(api.get('/users/me')),
  
  updateProfile: (userId: string, data: any) => 
    handleResponse(api.put(`/users/${userId}`, data)),
  
  getAllUsers: (page = 1, limit = 10, search = '') => 
    handleResponse(api.get(`/users?page=${page}&limit=${limit}&search=${search}`)),
  
  getUserById: (userId: string) => 
    handleResponse(api.get(`/users/${userId}`)),
  
  deleteUser: (userId: string) => 
    handleResponse(api.delete(`/users/${userId}`)),
  
  updateUserRole: (userId: string, role: string) => 
    handleResponse(api.put(`/users/${userId}/role`, { role })),
};

// Game related endpoints
export const gameApi = {
  createGame: (mode: string, options?: any) => 
    handleResponse(api.post('/games', { mode, ...options })),
  
  getGame: (gameId: string) => 
    handleResponse(api.get(`/games/${gameId}`)),
  
  makeMove: (gameId: string, move: any) => 
    handleResponse(api.post(`/games/${gameId}/moves`, move)),
  
  getRecentGames: (userId: string, limit = 5) => 
    handleResponse(api.get(`/users/${userId}/games?limit=${limit}`)),
  
  getAllGames: (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters as Record<string, string>
    });
    return handleResponse(api.get(`/games?${queryParams}`));
  },
  
  forceEndGame: (gameId: string, result: string) => 
    handleResponse(api.put(`/games/${gameId}/end`, { result })),
  
  getGameStats: (gameId: string) => 
    handleResponse(api.get(`/games/${gameId}/stats`)),
  
  offerDraw: (gameId: string) => 
    handleResponse(api.post(`/games/${gameId}/draw-offer`)),
  
  respondToDrawOffer: (gameId: string, accept: boolean) => 
    handleResponse(api.post(`/games/${gameId}/draw-response`, { accept })),
  
  resign: (gameId: string) => 
    handleResponse(api.post(`/games/${gameId}/resign`)),
};

// Tournament related endpoints
export const tournamentApi = {
  createTournament: (tournamentData: any) => 
    handleResponse(api.post('/tournaments', tournamentData)),
  
  getTournaments: (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters as Record<string, string>
    });
    return handleResponse(api.get(`/tournaments?${queryParams}`));
  },
  
  getTournamentById: (tournamentId: string) => 
    handleResponse(api.get(`/tournaments/${tournamentId}`)),
  
  joinTournament: (tournamentId: string) => 
    handleResponse(api.post(`/tournaments/${tournamentId}/join`)),
  
  leaveTournament: (tournamentId: string) => 
    handleResponse(api.post(`/tournaments/${tournamentId}/leave`)),
  
  updateTournament: (tournamentId: string, data: any) => 
    handleResponse(api.put(`/tournaments/${tournamentId}`, data)),
  
  deleteTournament: (tournamentId: string) => 
    handleResponse(api.delete(`/tournaments/${tournamentId}`)),
  
  getTournamentParticipants: (tournamentId: string) => 
    handleResponse(api.get(`/tournaments/${tournamentId}/participants`)),
  
  getTournamentMatches: (tournamentId: string) => 
    handleResponse(api.get(`/tournaments/${tournamentId}/matches`)),
  
  startTournament: (tournamentId: string) => 
    handleResponse(api.post(`/tournaments/${tournamentId}/start`)),
  
  endTournament: (tournamentId: string) => 
    handleResponse(api.post(`/tournaments/${tournamentId}/end`)),
};

// Learning related endpoints
export const learningApi = {
  getCourses: (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters as Record<string, string>
    });
    return handleResponse(api.get(`/courses?${queryParams}`));
  },
  
  getCourseById: (courseId: string) => 
    handleResponse(api.get(`/courses/${courseId}`)),
  
  createCourse: (courseData: any) => 
    handleResponse(api.post('/courses', courseData)),
  
  updateCourse: (courseId: string, data: any) => 
    handleResponse(api.put(`/courses/${courseId}`, data)),
  
  deleteCourse: (courseId: string) => 
    handleResponse(api.delete(`/courses/${courseId}`)),
  
  enrollInCourse: (courseId: string) => 
    handleResponse(api.post(`/courses/${courseId}/enroll`)),
  
  getPuzzles: (page = 1, limit = 10, difficulty = '') => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(difficulty ? { difficulty } : {})
    });
    return handleResponse(api.get(`/puzzles?${queryParams}`));
  },
  
  getPuzzleById: (puzzleId: string) => 
    handleResponse(api.get(`/puzzles/${puzzleId}`)),
  
  createPuzzle: (puzzleData: any) => 
    handleResponse(api.post('/puzzles', puzzleData)),
  
  updatePuzzle: (puzzleId: string, data: any) => 
    handleResponse(api.put(`/puzzles/${puzzleId}`, data)),
  
  deletePuzzle: (puzzleId: string) => 
    handleResponse(api.delete(`/puzzles/${puzzleId}`)),
  
  solvePuzzle: (puzzleId: string, moves: string[]) => 
    handleResponse(api.post(`/puzzles/${puzzleId}/solve`, { moves })),
};

// Store related endpoints
export const storeApi = {
  getProducts: (page = 1, limit = 10, category = '') => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category ? { category } : {})
    });
    return handleResponse(api.get(`/store/products?${queryParams}`));
  },
  
  getProductById: (productId: string) => 
    handleResponse(api.get(`/store/products/${productId}`)),
  
  createProduct: (productData: any) => 
    handleResponse(api.post('/store/products', productData)),
  
  updateProduct: (productId: string, data: any) => 
    handleResponse(api.put(`/store/products/${productId}`, data)),
  
  deleteProduct: (productId: string) => 
    handleResponse(api.delete(`/store/products/${productId}`)),
  
  createOrder: (orderData: any) => 
    handleResponse(api.post('/store/orders', orderData)),
  
  getOrders: (page = 1, limit = 10, userId = '') => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(userId ? { userId } : {})
    });
    return handleResponse(api.get(`/store/orders?${queryParams}`));
  },
  
  getOrderById: (orderId: string) => 
    handleResponse(api.get(`/store/orders/${orderId}`)),
  
  updateOrderStatus: (orderId: string, status: string) => 
    handleResponse(api.put(`/store/orders/${orderId}/status`, { status })),
};

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
};

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

// Content management endpoints
export const contentApi = {
  getPages: (page = 1, limit = 10) => 
    handleResponse(api.get(`/content/pages?page=${page}&limit=${limit}`)),
  
  getPageById: (pageId: string) => 
    handleResponse(api.get(`/content/pages/${pageId}`)),
  
  createPage: (pageData: any) => 
    handleResponse(api.post('/content/pages', pageData)),
  
  updatePage: (pageId: string, data: any) => 
    handleResponse(api.put(`/content/pages/${pageId}`, data)),
  
  deletePage: (pageId: string) => 
    handleResponse(api.delete(`/content/pages/${pageId}`)),
  
  publishPage: (pageId: string) => 
    handleResponse(api.put(`/content/pages/${pageId}/publish`)),
  
  unpublishPage: (pageId: string) => 
    handleResponse(api.put(`/content/pages/${pageId}/unpublish`)),
};

// Translation related endpoints
export const translationApi = {
  getLanguages: () => 
    handleResponse(api.get('/translations/languages')),
  
  getTranslations: (language: string, keys: string[] = []) => 
    handleResponse(api.post('/translations', { language, keys })),
  
  updateTranslation: (language: string, key: string, value: string) => 
    handleResponse(api.put('/translations', { language, key, value })),
  
  addLanguage: (language: string, name: string) => 
    handleResponse(api.post('/translations/languages', { language, name })),
};

// Websocket API endpoints
export const websocketApi = {
  getAuthToken: () => 
    handleResponse(api.get('/websocket/auth')),
};

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
