
import api from './api';

export interface GameState {
  id: string;
  fen: string;
  moves: string[];
  timers?: { w: number; b: number };
  result?: '1-0' | '0-1' | '½-½';
  whitePlayer?: {
    id: string;
    name: string;
    rating: number;
  };
  blackPlayer?: {
    id: string;
    name: string;
    rating: number;
  };
  startedAt?: string;
  lastMoveAt?: string;
}

export async function createGame(mode: string, options?: any): Promise<GameState> {
  // TODO: Implement actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'game_' + Math.random().toString(36).substr(2, 9),
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        moves: [],
        timers: { w: 600, b: 600 },
        whitePlayer: {
          id: 'user_1',
          name: 'You',
          rating: 1200
        },
        blackPlayer: {
          id: 'user_2',
          name: 'Opponent',
          rating: 1250
        },
        startedAt: new Date().toISOString(),
        lastMoveAt: new Date().toISOString()
      });
    }, 500);
  });
}

export async function getGame(gameId: string): Promise<GameState> {
  // TODO: Implement actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: gameId,
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
        moves: ['e4'],
        timers: { w: 595, b: 600 },
        whitePlayer: {
          id: 'user_1',
          name: 'You',
          rating: 1200
        },
        blackPlayer: {
          id: 'user_2',
          name: 'Opponent',
          rating: 1250
        },
        startedAt: new Date(Date.now() - 5000).toISOString(),
        lastMoveAt: new Date().toISOString()
      });
    }, 200);
  });
}

export async function makeMove(gameId: string, move: string): Promise<GameState> {
  // TODO: Implement actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: gameId,
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
        moves: ['e4', 'e5'],
        timers: { w: 595, b: 598 },
        whitePlayer: {
          id: 'user_1',
          name: 'You',
          rating: 1200
        },
        blackPlayer: {
          id: 'user_2',
          name: 'Opponent',
          rating: 1250
        },
        startedAt: new Date(Date.now() - 5000).toISOString(),
        lastMoveAt: new Date().toISOString()
      });
    }, 100);
  });
}

export async function getRecentGames(userId: string, limit = 5): Promise<GameState[]> {
  // TODO: Implement actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'game_1',
          fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
          moves: ['e4', 'e5', 'Nf3'],
          result: '1-0',
          whitePlayer: {
            id: 'user_1',
            name: 'You',
            rating: 1200
          },
          blackPlayer: {
            id: 'user_2',
            name: 'GrandMaster42',
            rating: 1150
          },
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          lastMoveAt: new Date(Date.now() - 3540000).toISOString()
        },
        {
          id: 'game_2',
          fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
          moves: ['e4', 'e5', 'Nf3', 'Nc6'],
          result: '0-1',
          whitePlayer: {
            id: 'user_3',
            name: 'ChessWizard',
            rating: 1300
          },
          blackPlayer: {
            id: 'user_1',
            name: 'You',
            rating: 1200
          },
          startedAt: new Date(Date.now() - 86400000).toISOString(),
          lastMoveAt: new Date(Date.now() - 86100000).toISOString()
        },
        {
          id: 'game_3',
          fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
          moves: ['e4', 'e5', 'Nf3', 'Nf6'],
          result: '½-½',
          whitePlayer: {
            id: 'user_1',
            name: 'You',
            rating: 1200
          },
          blackPlayer: {
            id: 'user_4',
            name: 'KnightRider',
            rating: 1220
          },
          startedAt: new Date(Date.now() - 172800000).toISOString(),
          lastMoveAt: new Date(Date.now() - 172500000).toISOString()
        }
      ]);
    }, 300);
  });
}
