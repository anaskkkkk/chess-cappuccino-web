
import api from './api';

export interface GameState {
  id: string;
  fen: string;
  moves: string[];
  timers?: { w: number; b: number };
  result?: '1-0' | '0-1' | '½-½';
  whitePlayer: {
    id: string;
    name: string;
    rating: number;
  };
  blackPlayer: {
    id: string;
    name: string;
    rating: number;
  };
  startedAt: string;
  lastMoveAt: string;
}

export type GameMode = 'quick' | 'friend' | 'ai' | 'tournament';

export interface GameOptions {
  timeControl?: string; // e.g., '5+3' for 5 minutes + 3 seconds increment
  color?: 'white' | 'black' | 'random';
  rated?: boolean;
  aiLevel?: number; // 1-10 for AI games
  friendId?: string; // for friend games
}

class GameService {
  async createGame(mode: GameMode, options: GameOptions = {}): Promise<GameState> {
    try {
      // TODO: Replace with actual API implementation
      const response = await Promise.resolve({
        data: {
          id: `game_${Math.random().toString(36).substr(2, 9)}`,
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // Starting position
          moves: [],
          timers: { w: options.timeControl ? parseInt(options.timeControl.split('+')[0]) * 60 : 600, b: options.timeControl ? parseInt(options.timeControl.split('+')[0]) * 60 : 600 },
          whitePlayer: {
            id: '1',
            name: 'You',
            rating: 1200
          },
          blackPlayer: {
            id: '2',
            name: mode === 'ai' ? 'AI Opponent' : 'Opponent',
            rating: 1250
          },
          startedAt: new Date().toISOString(),
          lastMoveAt: new Date().toISOString()
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Create game error:', error);
      throw new Error('Failed to create game. Please try again.');
    }
  }

  async getGame(gameId: string): Promise<GameState> {
    try {
      // TODO: Replace with actual API implementation
      const response = await Promise.resolve({
        data: {
          id: gameId,
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // Starting position
          moves: [],
          timers: { w: 600, b: 600 },
          whitePlayer: {
            id: '1',
            name: 'You',
            rating: 1200
          },
          blackPlayer: {
            id: '2',
            name: 'Opponent',
            rating: 1250
          },
          startedAt: new Date().toISOString(),
          lastMoveAt: new Date().toISOString()
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Get game ${gameId} error:`, error);
      throw new Error(`Failed to load game ${gameId}. Please try again.`);
    }
  }

  async makeMove(gameId: string, move: string): Promise<GameState> {
    try {
      // TODO: Replace with actual API implementation
      
      // This would normally send the move to the server and get back the updated game state
      const response = await Promise.resolve({
        data: {
          id: gameId,
          fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', // After e4
          moves: [move],
          timers: { w: 595, b: 600 },
          whitePlayer: {
            id: '1',
            name: 'You',
            rating: 1200
          },
          blackPlayer: {
            id: '2',
            name: 'Opponent',
            rating: 1250
          },
          startedAt: new Date(Date.now() - 5000).toISOString(),
          lastMoveAt: new Date().toISOString()
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Make move in game ${gameId} error:`, error);
      throw new Error('Failed to make move. Please try again.');
    }
  }

  async resignGame(gameId: string): Promise<GameState> {
    try {
      // TODO: Replace with actual API implementation
      const response = await Promise.resolve({
        data: {
          id: gameId,
          fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
          moves: ['e4'],
          result: '0-1', // Assuming the current user is playing white
          whitePlayer: {
            id: '1',
            name: 'You',
            rating: 1200
          },
          blackPlayer: {
            id: '2',
            name: 'Opponent',
            rating: 1250
          },
          startedAt: new Date(Date.now() - 60000).toISOString(),
          lastMoveAt: new Date().toISOString()
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Resign game ${gameId} error:`, error);
      throw new Error('Failed to resign game. Please try again.');
    }
  }

  async offerDraw(gameId: string): Promise<{ offered: boolean }> {
    try {
      // TODO: Replace with actual API implementation
      const response = await Promise.resolve({
        data: {
          offered: true
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Offer draw in game ${gameId} error:`, error);
      throw new Error('Failed to offer draw. Please try again.');
    }
  }

  async acceptDraw(gameId: string): Promise<GameState> {
    try {
      // TODO: Replace with actual API implementation
      const response = await Promise.resolve({
        data: {
          id: gameId,
          fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
          moves: ['e4'],
          result: '½-½',
          whitePlayer: {
            id: '1',
            name: 'You',
            rating: 1200
          },
          blackPlayer: {
            id: '2',
            name: 'Opponent',
            rating: 1250
          },
          startedAt: new Date(Date.now() - 120000).toISOString(),
          lastMoveAt: new Date().toISOString()
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Accept draw in game ${gameId} error:`, error);
      throw new Error('Failed to accept draw. Please try again.');
    }
  }
}

export default new GameService();
