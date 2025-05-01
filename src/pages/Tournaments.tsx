
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Clock, 
  Users, 
  Calendar, 
  ArrowRight, 
  Loader2,
  Medal,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/apiService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

// Mock tournament data for UI display
const MOCK_TOURNAMENTS = [
  {
    id: 'tourn-1',
    name: 'Weekend Blitz Championship',
    type: 'Blitz',
    timeControl: '3+2',
    participants: 64,
    startDate: '2025-05-04T14:00:00Z',
    registrationOpen: true,
    prize: '$500',
    status: 'upcoming'
  },
  {
    id: 'tourn-2',
    name: 'Monthly Classical Open',
    type: 'Classical',
    timeControl: '15+10',
    participants: 32,
    startDate: '2025-05-10T12:00:00Z',
    registrationOpen: true,
    prize: '$1000',
    status: 'upcoming'
  },
  {
    id: 'tourn-3',
    name: 'Rapid Masters Series',
    type: 'Rapid',
    timeControl: '10+5',
    participants: 128,
    startDate: '2025-05-15T18:00:00Z',
    registrationOpen: true,
    prize: '$750',
    status: 'upcoming'
  },
  {
    id: 'tourn-4',
    name: 'Daily Bullet Arena',
    type: 'Bullet',
    timeControl: '1+0',
    participants: 256,
    startDate: '2025-05-02T20:00:00Z',
    registrationOpen: false,
    prize: '$100',
    status: 'live'
  },
  {
    id: 'tourn-5',
    name: 'Grand Prix Qualifier',
    type: 'Rapid',
    timeControl: '15+0',
    participants: 64,
    startDate: '2025-04-30T16:00:00Z',
    registrationOpen: false,
    prize: '$2000',
    status: 'completed'
  }
];

const Tournaments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTournaments = MOCK_TOURNAMENTS.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || tournament.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleJoinTournament = async (tournamentId: string) => {
    try {
      setLoading(tournamentId);
      toast.info('Joining tournament...');
      
      // This would be connected to the actual API in production
      await apiService.joinTournament(tournamentId);
      
      toast.success('Successfully joined the tournament!');
      // Navigate to the tournament detail page
      navigate(`/tournaments/${tournamentId}`);
    } catch (error) {
      console.error('Failed to join tournament:', error);
      toast.error('Failed to join tournament. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-chess-text-light mb-4 flex items-center">
          <Trophy className="h-8 w-8 mr-3 text-chess-accent" />
          Tournaments
        </h1>
        <p className="text-gray-400 mb-8">Compete with players from around the world in organized chess tournaments.</p>
        
        {/* Search and filter */}
        <div className="mb-8">
          <div className="relative w-full md:w-1/2 mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-chess-dark border border-[rgba(255,255,255,0.2)] rounded-md text-chess-text-light focus:outline-none focus:border-chess-accent"
            />
          </div>
          
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-chess-dark border border-[rgba(255,255,255,0.1)]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Tournament list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTournaments.length > 0 ? (
            filteredTournaments.map((tournament) => (
              <div 
                key={tournament.id} 
                className="bg-chess-dark border-subtle hover-lift card-hover rounded-lg p-6 shadow-lg border border-[rgba(255,255,255,0.1)] transition-all hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-chess-text-light">{tournament.name}</h3>
                    <div className="flex items-center mt-1 text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">{formatDate(tournament.startDate)}</span>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-chess-accent/20 text-chess-accent text-sm font-medium">
                    {tournament.type}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Time Control</span>
                    <div className="flex items-center text-chess-text-light">
                      <Clock className="h-4 w-4 mr-1 text-chess-accent" />
                      {tournament.timeControl}
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Participants</span>
                    <div className="flex items-center text-chess-text-light">
                      <Users className="h-4 w-4 mr-1 text-chess-accent" />
                      {tournament.participants}
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Status</span>
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        tournament.status === 'live' ? 'bg-green-500' : 
                        tournament.status === 'upcoming' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></span>
                      <span className="capitalize text-chess-text-light">
                        {tournament.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Prize</span>
                    <div className="flex items-center text-chess-text-light">
                      <Medal className="h-4 w-4 mr-1 text-chess-accent" />
                      {tournament.prize}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    className="border-chess-accent text-chess-accent hover:bg-chess-accent/10"
                    onClick={() => navigate(`/tournaments/${tournament.id}`)}
                  >
                    Details
                  </Button>
                  
                  {tournament.status === 'live' ? (
                    <Button
                      className="bg-chess-accent text-chess-text-light hover:bg-opacity-90"
                      onClick={() => navigate(`/spectate/${tournament.id}`)}
                    >
                      Watch Live <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : tournament.registrationOpen ? (
                    <Button
                      className="bg-chess-accent text-chess-text-light hover:bg-opacity-90"
                      onClick={() => handleJoinTournament(tournament.id)}
                      disabled={loading === tournament.id}
                    >
                      {loading === tournament.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>Join Tournament</>
                      )}
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="bg-gray-700 text-gray-400 cursor-not-allowed"
                    >
                      Registration Closed
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center py-12 text-gray-400">
              <Trophy className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-xl">No tournaments found</p>
              <p className="mt-2">Try changing your search criteria</p>
            </div>
          )}
        </div>
        
        {/* Create tournament button (for administrators) */}
        <div className="mt-12 text-center">
          <Button
            className="bg-chess-accent text-chess-text-light hover:bg-opacity-90"
            onClick={() => toast.info('Tournament creation coming soon!')}
          >
            Create Tournament
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Tournaments;
