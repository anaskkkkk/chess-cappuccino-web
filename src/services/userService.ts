
import api from './api';

export interface UserStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  rating: number;
  highestRating: number;
  puzzlesSolved: number;
  currentStreak: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  country?: string;
  rating: number;
  joinDate: string;
  lastSeen?: string;
  hasBoard: boolean;
  skillLevel: number;
  playFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  goals: {
    improve: boolean;
    compete: boolean;
    fun: boolean;
    learn: boolean;
    teach: boolean;
  };
}

class UserService {
  async getUserProfile(userId: string = 'me'): Promise<UserProfile> {
    try {
      // TODO: Replace with actual API implementation
      const response = await Promise.resolve({
        data: {
          id: userId === 'me' ? '1' : userId,
          name: 'Test User',
          email: 'user@example.com',
          avatarUrl: '',
          bio: 'Chess enthusiast',
          country: 'United States',
          rating: 1200,
          joinDate: '2023-01-01T00:00:00Z',
          lastSeen: new Date().toISOString(),
          hasBoard: true,
          skillLevel: 3,
          playFrequency: 'weekly',
          goals: {
            improve: true,
            compete: false,
            fun: true,
            learn: true,
            teach: false
          }
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw new Error('Failed to load user profile');
    }
  }
  
  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      // TODO: Replace with actual API implementation
      const response = await Promise.resolve({
        data: {
          id: '1',
          name: profile.name || 'Test User',
          email: 'user@example.com',
          avatarUrl: profile.avatarUrl || '',
          bio: profile.bio || 'Chess enthusiast',
          country: profile.country || 'United States',
          rating: 1200,
          joinDate: '2023-01-01T00:00:00Z',
          lastSeen: new Date().toISOString(),
          hasBoard: profile.hasBoard !== undefined ? profile.hasBoard : true,
          skillLevel: profile.skillLevel || 3,
          playFrequency: profile.playFrequency || 'weekly',
          goals: profile.goals || {
            improve: true,
            compete: false,
            fun: true,
            learn: true,
            teach: false
          }
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw new Error('Failed to update profile');
    }
  }
  
  async getUserStats(): Promise<UserStats> {
    try {
      // TODO: Replace with actual API implementation
      const response = await Promise.resolve({
        data: {
          gamesPlayed: 42,
          wins: 25,
          losses: 12,
          draws: 5,
          winRate: 65,
          rating: 1250,
          highestRating: 1300,
          puzzlesSolved: 128,
          currentStreak: 5
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get user stats error:', error);
      throw new Error('Failed to load user statistics');
    }
  }
  
  async pairBoard(boardId: string): Promise<{ success: boolean; message: string }> {
    try {
      // TODO: Replace with actual API implementation
      const response = await Promise.resolve({
        data: {
          success: true,
          message: 'Board successfully paired'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Pair board error:', error);
      throw new Error('Failed to pair your SmartChess board');
    }
  }
}

export default new UserService();
