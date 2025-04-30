
import api from './api';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  country?: string;
  rating: number;
  joinDate?: string;
  lastSeen?: string;
  hasBoard?: boolean;
  skillLevel?: number;
  playFrequency?: 'daily' | 'weekly' | 'monthly' | 'rarely';
  goals?: {
    improvement?: boolean;
    fun?: boolean;
    competition?: boolean;
    social?: boolean;
  };
}

export interface UserStats {
  gamesPlayed: number;
  winRate: number;
  puzzlesSolved: number;
  currentStreak: number;
  rating: number;
  bestWin?: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  // TODO: Implement actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: 'Chess Player',
        email: 'player@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=' + userId,
        bio: 'Chess enthusiast since 2010.',
        country: 'United States',
        rating: 1250,
        joinDate: '2023-01-15T00:00:00Z',
        lastSeen: new Date().toISOString(),
        hasBoard: true,
        skillLevel: 3,
        playFrequency: 'weekly',
        goals: {
          improvement: true,
          fun: true,
          competition: false,
          social: true
        }
      });
    }, 300);
  });
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
  // TODO: Implement actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: data.name || 'Chess Player',
        email: data.email || 'player@example.com',
        avatarUrl: data.avatarUrl || 'https://i.pravatar.cc/150?u=' + userId,
        bio: data.bio || 'Chess enthusiast since 2010.',
        country: data.country || 'United States',
        rating: data.rating || 1250,
        joinDate: '2023-01-15T00:00:00Z',
        lastSeen: new Date().toISOString(),
        hasBoard: data.hasBoard !== undefined ? data.hasBoard : true,
        skillLevel: data.skillLevel !== undefined ? data.skillLevel : 3,
        playFrequency: data.playFrequency || 'weekly',
        goals: data.goals || {
          improvement: true,
          fun: true,
          competition: false,
          social: true
        }
      });
    }, 200);
  });
}

export async function getUserStats(userId: string): Promise<UserStats> {
  // TODO: Implement actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        gamesPlayed: 42,
        winRate: 65,
        puzzlesSolved: 128,
        currentStreak: 5,
        rating: 1250,
        bestWin: 'Magnus Carlsen'
      });
    }, 500);
  });
}
