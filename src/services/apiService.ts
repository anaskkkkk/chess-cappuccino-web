import { 
  userApi,
  gameApi,
  tournamentApi,
  learningApi,
  storeApi,
  smartBoardApi,
  adminApi,
  contentApi,
  translationApi,
  analyticsApi
} from './api/apiEndpoints';
import { GameOptions, GameState } from './gameService';

/**
 * Central place for all REST API calls
 * This service uses the apiEndpoints to make all API calls
 */
class ApiService {
  //==========================================================================
  // USER RELATED API CALLS
  //==========================================================================
  
  async getUserProfile(userId: string) {
    return userApi.getUserById(userId);
  }
  
  async updateUserProfile(userId: string, data: any) {
    return userApi.updateProfile(userId, data);
  }
  
  //==========================================================================
  // GAME RELATED API CALLS
  //==========================================================================
  
  async createGame(mode: string, options?: GameOptions): Promise<GameState> {
    return gameApi.createGame(mode, options);
  }
  
  async getGame(gameId: string): Promise<GameState> {
    return gameApi.getGame(gameId);
  }
  
  async getRecentGames(userId: string, limit = 5): Promise<GameState[]> {
    return gameApi.getRecentGames(userId, limit);
  }
  
  //==========================================================================
  // TOURNAMENT RELATED API CALLS
  //==========================================================================
  
  async getTournaments(page = 1, limit = 10) {
    return tournamentApi.getTournaments(page, limit);
  }
  
  async joinTournament(tournamentId: string) {
    return tournamentApi.joinTournament(tournamentId);
  }
  
  async getTournamentDetails(tournamentId: string) {
    return tournamentApi.getTournamentById(tournamentId);
  }
  
  //==========================================================================
  // LEADERBOARD RELATED API CALLS
  //==========================================================================
  
  async getLeaderboard(timeframe = 'monthly', page = 1, limit = 10) {
    return userApi.getAllUsers(page, limit, { sortBy: 'rating', timeframe });
  }
  
  //==========================================================================
  // LEARNING RELATED API CALLS
  //==========================================================================
  
  async getCourses(page = 1, limit = 10) {
    return learningApi.getCourses(page, limit);
  }
  
  async getCourseDetails(courseId: string) {
    return learningApi.getCourseById(courseId);
  }
  
  async getPuzzles(difficulty: string, page = 1, limit = 10) {
    return learningApi.getPuzzles(page, limit, difficulty);
  }
  
  //==========================================================================
  // STORE RELATED API CALLS
  //==========================================================================
  
  async getStoreItems(category = 'all', page = 1, limit = 10) {
    return storeApi.getProducts(page, limit, category);
  }
  
  async getStoreItem(itemId: string) {
    return storeApi.getProductById(itemId);
  }
  
  async createOrder(items: {id: string, quantity: number}[]) {
    return storeApi.createOrder({ items });
  }
  
  async processPayment(orderId: string, paymentDetails: any) {
    // TODO: Implement payment processing endpoint
    return storeApi.updateOrderStatus(orderId, 'paid');
  }
  
  //==========================================================================
  // SMARTBOARD RELATED API CALLS
  //==========================================================================
  
  async pairSmartBoard(boardId: string, userId: string) {
    return smartBoardApi.pairBoard(boardId, userId);
  }
  
  async getSmartBoardStatus(userId: string) {
    // This is a mock implementation for now
    // In reality, we should get the board ID associated with the user first
    return { connected: Math.random() > 0.3 };
  }
  
  //==========================================================================
  // ADMIN RELATED API CALLS
  //==========================================================================
  
  async getAdminDashboardStats() {
    return adminApi.getDashboardStats();
  }
  
  async getSystemHealth() {
    return adminApi.getSystemHealth();
  }
  
  //==========================================================================
  // TRANSLATION RELATED API CALLS
  //==========================================================================
  
  async getTranslations(language: string, keys: string[]) {
    return translationApi.getTranslations(language, keys);
  }
  
  //==========================================================================
  // WEBSOCKET RELATED API CALLS
  //==========================================================================
  
  async getWebSocketToken() {
    // Mock implementation until we have a real endpoint
    return { token: "mock-websocket-token-" + Date.now() };
  }
}

const apiService = new ApiService();
export default apiService;
