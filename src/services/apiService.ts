
import api from './api';
import { GameOptions, GameState } from './gameService';

/**
 * Central place for all REST API calls
 */
class ApiService {
  //==========================================================================
  // USER RELATED API CALLS
  //==========================================================================
  
  // TODO: REST API - Get user profile
  async getUserProfile(userId: string) {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
  
  // TODO: REST API - Update user profile
  async updateUserProfile(userId: string, data: any) {
    try {
      const response = await api.put(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // GAME RELATED API CALLS
  //==========================================================================
  
  // TODO: REST API - Create a new game
  async createGame(mode: string, options?: GameOptions): Promise<GameState> {
    try {
      const response = await api.post('/games', { mode, ...options });
      return response.data;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }
  
  // TODO: REST API - Get game by ID
  async getGame(gameId: string): Promise<GameState> {
    try {
      const response = await api.get(`/games/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game:', error);
      throw error;
    }
  }
  
  // TODO: REST API - Get recent games for a user
  async getRecentGames(userId: string, limit = 5): Promise<GameState[]> {
    try {
      const response = await api.get(`/users/${userId}/games?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent games:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // TOURNAMENT RELATED API CALLS
  //==========================================================================
  
  // TODO: REST API - Get available tournaments
  async getTournaments(page = 1, limit = 10) {
    try {
      const response = await api.get(`/tournaments?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }
  }
  
  // TODO: REST API - Join tournament
  async joinTournament(tournamentId: string) {
    try {
      const response = await api.post(`/tournaments/${tournamentId}/join`);
      return response.data;
    } catch (error) {
      console.error('Error joining tournament:', error);
      throw error;
    }
  }
  
  // TODO: REST API - Get tournament details
  async getTournamentDetails(tournamentId: string) {
    try {
      const response = await api.get(`/tournaments/${tournamentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tournament details:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // LEADERBOARD RELATED API CALLS
  //==========================================================================
  
  // TODO: REST API - Get leaderboard
  async getLeaderboard(timeframe = 'monthly', page = 1, limit = 10) {
    try {
      const response = await api.get(`/leaderboard?timeframe=${timeframe}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // LEARNING RELATED API CALLS
  //==========================================================================
  
  // TODO: REST API - Get available courses
  async getCourses(page = 1, limit = 10) {
    try {
      const response = await api.get(`/courses?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }
  
  // TODO: REST API - Get course details
  async getCourseDetails(courseId: string) {
    try {
      const response = await api.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course details:', error);
      throw error;
    }
  }
  
  // TODO: REST API - Get puzzles
  async getPuzzles(difficulty: string, page = 1, limit = 10) {
    try {
      const response = await api.get(`/puzzles?difficulty=${difficulty}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching puzzles:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // STORE RELATED API CALLS
  //==========================================================================
  
  // TODO: REST API - Get store items
  async getStoreItems(category = 'all', page = 1, limit = 10) {
    try {
      const response = await api.get(`/store/items?category=${category}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching store items:', error);
      throw error;
    }
  }
  
  // TODO: REST API - Get store item details
  async getStoreItem(itemId: string) {
    try {
      const response = await api.get(`/store/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching store item:', error);
      throw error;
    }
  }
  
  // TODO: REST API - Create order
  async createOrder(items: {id: string, quantity: number}[]) {
    try {
      const response = await api.post('/orders', { items });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
  
  // TODO: REST API - Process payment
  async processPayment(orderId: string, paymentDetails: any) {
    try {
      const response = await api.post(`/orders/${orderId}/payment`, paymentDetails);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // SMARTBOARD RELATED API CALLS
  //==========================================================================
  
  // TODO: REST API - Pair SmartBoard
  async pairSmartBoard(boardId: string, userId: string) {
    try {
      const response = await api.post('/smart-board/pair', { boardId, userId });
      return response.data;
    } catch (error) {
      console.error('Error pairing SmartBoard:', error);
      throw error;
    }
  }
  
  // TODO: REST API - Get SmartBoard connection status
  async getSmartBoardStatus(userId: string) {
    try {
      const response = await api.get(`/users/${userId}/smart-board`);
      return response.data;
    } catch (error) {
      console.error('Error fetching SmartBoard status:', error);
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService;
