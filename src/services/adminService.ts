
import api from './api';

/**
 * Admin Service - Centralized place for all admin-related API calls
 */
class AdminService {
  //==========================================================================
  // ADMIN DASHBOARD
  //==========================================================================
  
  // TODO: REST API - Get admin dashboard stats
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // USER MANAGEMENT
  //==========================================================================
  
  // TODO: REST API - Get all users with pagination
  async getUsers(page = 1, limit = 10, filter = "") {
    try {
      const response = await api.get(`/admin/users?page=${page}&limit=${limit}&filter=${filter}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // TODO: REST API - Get user by ID
  async getUserById(userId: string) {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  }

  // TODO: REST API - Create new user
  async createUser(userData: any) {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // TODO: REST API - Update user
  async updateUser(userId: string, userData: any) {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // TODO: REST API - Delete user
  async deleteUser(userId: string) {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // GAME MANAGEMENT
  //==========================================================================
  
  // TODO: REST API - Get all games with pagination
  async getGames(page = 1, limit = 10, filter = "") {
    try {
      const response = await api.get(`/admin/games?page=${page}&limit=${limit}&filter=${filter}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }

  // TODO: REST API - Get game by ID with additional details
  async getGameById(gameId: string) {
    try {
      const response = await api.get(`/admin/games/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game details:', error);
      throw error;
    }
  }

  // TODO: REST API - Force end a game
  async forceEndGame(gameId: string, result: string) {
    try {
      const response = await api.post(`/admin/games/${gameId}/force-end`, { result });
      return response.data;
    } catch (error) {
      console.error('Error forcing game end:', error);
      throw error;
    }
  }

  // TODO: REST API - Delete game record
  async deleteGame(gameId: string) {
    try {
      const response = await api.delete(`/admin/games/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // TOURNAMENT MANAGEMENT
  //==========================================================================
  
  // TODO: REST API - Get all tournaments with pagination
  async getTournaments(page = 1, limit = 10, filter = "") {
    try {
      const response = await api.get(`/admin/tournaments?page=${page}&limit=${limit}&filter=${filter}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }
  }

  // TODO: REST API - Create tournament
  async createTournament(tournamentData: any) {
    try {
      const response = await api.post('/admin/tournaments', tournamentData);
      return response.data;
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
  }

  // TODO: REST API - Update tournament
  async updateTournament(tournamentId: string, tournamentData: any) {
    try {
      const response = await api.put(`/admin/tournaments/${tournamentId}`, tournamentData);
      return response.data;
    } catch (error) {
      console.error('Error updating tournament:', error);
      throw error;
    }
  }

  // TODO: REST API - Delete tournament
  async deleteTournament(tournamentId: string) {
    try {
      const response = await api.delete(`/admin/tournaments/${tournamentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting tournament:', error);
      throw error;
    }
  }

  // TODO: REST API - Start tournament
  async startTournament(tournamentId: string) {
    try {
      const response = await api.post(`/admin/tournaments/${tournamentId}/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting tournament:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // COURSE MANAGEMENT
  //==========================================================================
  
  // TODO: REST API - Get all courses with pagination
  async getCourses(page = 1, limit = 10, filter = "") {
    try {
      const response = await api.get(`/admin/courses?page=${page}&limit=${limit}&filter=${filter}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // TODO: REST API - Create course
  async createCourse(courseData: any) {
    try {
      const response = await api.post('/admin/courses', courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  // TODO: REST API - Update course
  async updateCourse(courseId: string, courseData: any) {
    try {
      const response = await api.put(`/admin/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  // TODO: REST API - Delete course
  async deleteCourse(courseId: string) {
    try {
      const response = await api.delete(`/admin/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  // TODO: REST API - Publish/Unpublish course
  async toggleCoursePublishStatus(courseId: string, isPublished: boolean) {
    try {
      const response = await api.put(`/admin/courses/${courseId}/publish`, { isPublished });
      return response.data;
    } catch (error) {
      console.error('Error toggling course publish status:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // PUZZLE MANAGEMENT
  //==========================================================================
  
  // TODO: REST API - Get all puzzles with pagination
  async getPuzzles(page = 1, limit = 10, filter = "") {
    try {
      const response = await api.get(`/admin/puzzles?page=${page}&limit=${limit}&filter=${filter}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching puzzles:', error);
      throw error;
    }
  }

  // TODO: REST API - Create puzzle
  async createPuzzle(puzzleData: any) {
    try {
      const response = await api.post('/admin/puzzles', puzzleData);
      return response.data;
    } catch (error) {
      console.error('Error creating puzzle:', error);
      throw error;
    }
  }

  // TODO: REST API - Update puzzle
  async updatePuzzle(puzzleId: string, puzzleData: any) {
    try {
      const response = await api.put(`/admin/puzzles/${puzzleId}`, puzzleData);
      return response.data;
    } catch (error) {
      console.error('Error updating puzzle:', error);
      throw error;
    }
  }

  // TODO: REST API - Delete puzzle
  async deletePuzzle(puzzleId: string) {
    try {
      const response = await api.delete(`/admin/puzzles/${puzzleId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting puzzle:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // ORDER & PAYMENT MANAGEMENT
  //==========================================================================
  
  // TODO: REST API - Get all orders with pagination
  async getOrders(page = 1, limit = 10, filter = "") {
    try {
      const response = await api.get(`/admin/orders?page=${page}&limit=${limit}&filter=${filter}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // TODO: REST API - Get order by ID
  async getOrderById(orderId: string) {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  // TODO: REST API - Update order status
  async updateOrderStatus(orderId: string, status: string) {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // TODO: REST API - Refund payment
  async refundPayment(paymentId: string, amount?: number) {
    try {
      const response = await api.post(`/admin/payments/${paymentId}/refund`, { amount });
      return response.data;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // SMARTBOARD FLEET MANAGEMENT
  //==========================================================================
  
  // TODO: REST API - Get all smart boards
  async getSmartBoards(page = 1, limit = 10, filter = "") {
    try {
      const response = await api.get(`/admin/smart-boards?page=${page}&limit=${limit}&filter=${filter}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching smart boards:', error);
      throw error;
    }
  }

  // TODO: REST API - Get smart board by ID
  async getSmartBoardById(boardId: string) {
    try {
      const response = await api.get(`/admin/smart-boards/${boardId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching smart board details:', error);
      throw error;
    }
  }

  // TODO: REST API - Update smart board
  async updateSmartBoard(boardId: string, boardData: any) {
    try {
      const response = await api.put(`/admin/smart-boards/${boardId}`, boardData);
      return response.data;
    } catch (error) {
      console.error('Error updating smart board:', error);
      throw error;
    }
  }

  // TODO: REST API - Push OTA update to smart board
  async pushOTAUpdate(boardId: string, version: string) {
    try {
      const response = await api.post(`/admin/smart-boards/${boardId}/ota`, { version });
      return response.data;
    } catch (error) {
      console.error('Error pushing OTA update:', error);
      throw error;
    }
  }

  // TODO: REST API - Remote reset smart board
  async remoteResetSmartBoard(boardId: string) {
    try {
      const response = await api.post(`/admin/smart-boards/${boardId}/reset`);
      return response.data;
    } catch (error) {
      console.error('Error resetting smart board:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // SYSTEM MANAGEMENT
  //==========================================================================
  
  // TODO: REST API - Get system logs
  async getSystemLogs(page = 1, limit = 50, level = "all") {
    try {
      const response = await api.get(`/admin/system/logs?page=${page}&limit=${limit}&level=${level}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching system logs:', error);
      throw error;
    }
  }

  // TODO: REST API - Get system health
  async getSystemHealth() {
    try {
      const response = await api.get('/admin/system/health');
      return response.data;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  }

  // TODO: REST API - Create system backup
  async createBackup() {
    try {
      const response = await api.post('/admin/system/backup');
      return response.data;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  // TODO: REST API - Restore from backup
  async restoreFromBackup(backupId: string) {
    try {
      const response = await api.post(`/admin/system/restore/${backupId}`);
      return response.data;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      throw error;
    }
  }
  
  //==========================================================================
  // FEATURE FLAGS & SETTINGS
  //==========================================================================
  
  // TODO: REST API - Get all feature flags
  async getFeatureFlags() {
    try {
      const response = await api.get('/admin/features');
      return response.data;
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      throw error;
    }
  }

  // TODO: REST API - Update feature flag
  async updateFeatureFlag(flagName: string, isEnabled: boolean) {
    try {
      const response = await api.put(`/admin/features/${flagName}`, { isEnabled });
      return response.data;
    } catch (error) {
      console.error('Error updating feature flag:', error);
      throw error;
    }
  }

  // TODO: REST API - Get all system settings
  async getSystemSettings() {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  }

  // TODO: REST API - Update system setting
  async updateSystemSetting(settingName: string, value: any) {
    try {
      const response = await api.put(`/admin/settings/${settingName}`, { value });
      return response.data;
    } catch (error) {
      console.error('Error updating system setting:', error);
      throw error;
    }
  }
}

const adminService = new AdminService();
export default adminService;
