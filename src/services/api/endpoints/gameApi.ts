
import api, { handleResponse } from '../index';

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
