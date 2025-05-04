
import api, { handleResponse } from '../index';

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
