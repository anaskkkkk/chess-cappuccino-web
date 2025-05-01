
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ChessboardComponent from '@/components/game/Chessboard';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Users,
  Star,
  Clock,
  MessageSquare,
  ArrowUpDown,
  Trophy,
  Flag,
  UserCircle,
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import apiService from '@/services/apiService';
import useWebSocket from '@/hooks/useWebSocket';
import audioService from '@/services/audioService';

// Mock games data
const MOCK_LIVE_GAMES = [
  {
    id: 'game-1',
    white: { name: 'GrandMaster88', rating: 2720, title: 'GM' },
    black: { name: 'ChessWizard', rating: 2680, title: 'IM' },
    timeControl: '5+3',
    moves: 12,
    viewers: 1240,
    featured: true,
    fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    lastMove: { from: 'd7', to: 'd5' }
  },
  {
    id: 'game-2',
    white: { name: 'BerlinDefender', rating: 2540, title: 'FM' },
    black: { name: 'SicilianMaster', rating: 2610, title: 'GM' },
    timeControl: '3+2',
    moves: 18,
    viewers: 856,
    featured: true, 
    fen: 'rnbqkb1r/pp2pppp/5n2/2pp4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 5',
    lastMove: { from: 'c6', to: 'd5' }
  },
  {
    id: 'game-3',
    white: { name: 'KingHunter', rating: 2320, title: 'CM' },
    black: { name: 'QueenSacrifice', rating: 2290, title: null },
    timeControl: '10+0',
    moves: 24,
    viewers: 312,
    featured: false,
    fen: 'r1bqk2r/ppp2ppp/2n1pn2/3p4/1bPP4/2NBP3/PP3PPP/R1BQK1NR b KQkq - 2 6',
    lastMove: { from: 'f1', to: 'c4' }
  },
  {
    id: 'game-4',
    white: { name: 'EndgameMagician', rating: 2480, title: 'IM' },
    black: { name: 'TacticalGenius', rating: 2410, title: 'IM' },
    timeControl: '15+10',
    moves: 32,
    viewers: 567,
    featured: false,
    fen: 'r4rk1/pp2ppbp/2n3p1/q1pp4/3P1B2/2P1PN2/PP3PPP/R2Q1RK1 w - - 0 12',
    lastMove: { from: 'd8', to: 'a5' }
  },
  {
    id: 'game-5',
    white: { name: 'OpeningExpert', rating: 2200, title: null },
    black: { name: 'DefenseKing', rating: 2250, title: null },
    timeControl: '3+0',
    moves: 8,
    viewers: 124,
    featured: false,
    fen: 'rnbqkb1r/pppp1ppp/4pn2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
    lastMove: { from: 'g8', to: 'f6' }
  }
];

// Mock tournaments data
const MOCK_TOURNAMENTS = [
  {
    id: 'tourn-1',
    name: 'Spring Masters Championship',
    players: 16,
    games: 28,
    round: 'Quarter-finals',
    type: 'Knockout',
    status: 'live'
  },
  {
    id: 'tourn-2',
    name: 'Grand Prix 2025',
    players: 24,
    games: 46,
    round: 'Round 4',
    type: 'Swiss',
    status: 'live'
  }
];

const Spectate = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('featured');
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<any[]>(MOCK_LIVE_GAMES);
  const [tournaments, setTournaments] = useState<any[]>(MOCK_TOURNAMENTS);

  // Connect to WebSocket for live games updates
  const { status: wsStatus } = useWebSocket<any[]>(
    'live_games_update',
    (data) => {
      console.log('Received live games update:', data);
      setGames(data || MOCK_LIVE_GAMES);
    },
    {
      autoConnect: true,
      onOpen: () => {
        console.log('Connected to live games websocket');
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
      }
    }
  );
  
  const filteredGames = games.filter(game => {
    if (activeTab === 'featured' && !game.featured) return false;
    
    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return game.white.name.toLowerCase().includes(searchLower) || 
             game.black.name.toLowerCase().includes(searchLower);
    }
    
    return true;
  });

  useEffect(() => {
    // Auto-select the first game when the component loads
    if (games.length > 0 && !selectedGame) {
      setSelectedGame(games[0]);
    }
  }, [games, selectedGame]);

  const handleGameSelect = (game: any) => {
    setSelectedGame(game);
    audioService.playNotificationSound();
  };

  const handleGameNavigate = (gameId: string) => {
    navigate(`/spectate/game/${gameId}`);
  };

  const handleTournamentNavigate = (tournamentId: string) => {
    navigate(`/tournaments/${tournamentId}`);
  };

  const handleRefreshGames = () => {
    setLoading(true);
    
    // In a real app, this would fetch from the API
    setTimeout(() => {
      toast.success('Games refreshed');
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-chess-text-light mb-4 flex items-center">
          <Eye className="h-8 w-8 mr-3 text-chess-accent" />
          Spectate
        </h1>
        <p className="text-gray-400 mb-8">Watch live games from top players around the world.</p>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar - Game list */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-chess-dark border border-[rgba(255,255,255,0.2)] rounded-md text-chess-text-light focus:outline-none focus:border-chess-accent"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <Tabs defaultValue="featured" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-chess-dark border border-[rgba(255,255,255,0.1)]">
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="all">All Games</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button
                variant="outline" 
                size="sm"
                className="border-[rgba(255,255,255,0.2)] text-chess-text-light hover:bg-white/5"
                onClick={handleRefreshGames}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpDown className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {filteredGames.length > 0 ? (
                filteredGames.map(game => (
                  <div
                    key={game.id}
                    className={`border rounded-md p-3 cursor-pointer transition-all hover:border-chess-accent ${
                      selectedGame?.id === game.id 
                      ? 'bg-chess-accent/10 border-chess-accent' 
                      : 'border-[rgba(255,255,255,0.1)] bg-chess-dark hover:bg-white/5'
                    }`}
                    onClick={() => handleGameSelect(game)}
                  >
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-chess-accent" />
                        <span className="text-sm text-gray-300">{game.timeControl}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1 text-chess-accent" />
                        <span className="text-sm text-gray-300">{game.viewers}</span>
                      </div>
                      {game.featured && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        {game.white.title && (
                          <span className="text-xs bg-chess-accent/20 text-chess-accent px-1 rounded mr-1">
                            {game.white.title}
                          </span>
                        )}
                        <span className="text-chess-text-light font-medium">{game.white.name}</span>
                      </div>
                      <span className="text-chess-text-light">{game.white.rating}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {game.black.title && (
                          <span className="text-xs bg-chess-accent/20 text-chess-accent px-1 rounded mr-1">
                            {game.black.title}
                          </span>
                        )}
                        <span className="text-chess-text-light font-medium">{game.black.name}</span>
                      </div>
                      <span className="text-chess-text-light">{game.black.rating}</span>
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
                      <span>{game.moves} moves</span>
                      <Button
                        variant="ghost" 
                        size="sm"
                        className="h-7 px-2 text-chess-accent hover:bg-chess-accent/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGameNavigate(game.id);
                        }}
                      >
                        Full View <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No games match your search criteria
                </div>
              )}
            </div>
            
            {/* Live tournaments section */}
            <div className="mt-6">
              <h3 className="text-xl font-bold text-chess-text-light mb-3 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-chess-accent" />
                Live Tournaments
              </h3>
              
              <div className="space-y-3">
                {tournaments.map(tournament => (
                  <div
                    key={tournament.id}
                    className="border border-[rgba(255,255,255,0.1)] rounded-md p-3 bg-chess-dark hover:bg-white/5 hover:border-chess-accent transition-all cursor-pointer"
                    onClick={() => handleTournamentNavigate(tournament.id)}
                  >
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium text-chess-text-light">{tournament.name}</h4>
                      <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Live</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1 text-sm mb-2">
                      <div className="flex items-center text-gray-300">
                        <Users className="h-3 w-3 mr-1 text-chess-accent" />
                        {tournament.players} Players
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Flag className="h-3 w-3 mr-1 text-chess-accent" />
                        {tournament.round}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-chess-accent hover:bg-chess-accent/10"
                      >
                        Details <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main content - Selected game */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            {selectedGame ? (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h2 className="text-2xl font-bold text-chess-text-light mb-2 md:mb-0">
                    {selectedGame.white.name} vs {selectedGame.black.name}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-1 text-chess-accent" />
                      <span className="text-gray-300">{selectedGame.timeControl}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 mr-1 text-chess-accent" />
                      <span className="text-gray-300">{selectedGame.viewers} watching</span>
                    </div>
                    <Button
                      onClick={() => handleGameNavigate(selectedGame.id)}
                      className="bg-chess-accent text-chess-text-light hover:bg-opacity-90"
                    >
                      Full View
                    </Button>
                  </div>
                </div>
                
                {/* Player info - white */}
                <div className="flex justify-between items-center mb-2 p-3 bg-chess-dark border border-[rgba(255,255,255,0.1)] rounded-md">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 text-black font-bold text-xl">
                      W
                    </div>
                    <div>
                      <div className="flex items-center">
                        {selectedGame.white.title && (
                          <span className="text-xs bg-chess-accent/20 text-chess-accent px-1 rounded mr-2">
                            {selectedGame.white.title}
                          </span>
                        )}
                        <span className="text-lg font-bold text-chess-text-light">{selectedGame.white.name}</span>
                      </div>
                      <div className="text-sm text-gray-400">Rating: {selectedGame.white.rating}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-chess-text-light">10:24</div>
                </div>
                
                {/* Chess board */}
                <ChessboardComponent
                  fen={selectedGame.fen}
                  playerColor="w"
                  lastMove={selectedGame.lastMove}
                  selectedSquare={null}
                  legalMoves={[]}
                  onSquareClick={() => {}} // Read-only in spectate mode
                  inCheck={false}
                  checkSquare={null}
                />
                
                {/* Player info - black */}
                <div className="flex justify-between items-center mt-2 p-3 bg-chess-dark border border-[rgba(255,255,255,0.1)] rounded-md">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3 text-white font-bold text-xl">
                      B
                    </div>
                    <div>
                      <div className="flex items-center">
                        {selectedGame.black.title && (
                          <span className="text-xs bg-chess-accent/20 text-chess-accent px-1 rounded mr-2">
                            {selectedGame.black.title}
                          </span>
                        )}
                        <span className="text-lg font-bold text-chess-text-light">{selectedGame.black.name}</span>
                      </div>
                      <div className="text-sm text-gray-400">Rating: {selectedGame.black.rating}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-chess-text-light">08:37</div>
                </div>
                
                {/* Game info and chat tabs */}
                <div className="mt-6">
                  <Tabs defaultValue="moves">
                    <TabsList className="w-full bg-chess-dark border border-[rgba(255,255,255,0.1)]">
                      <TabsTrigger value="moves" className="flex-1">Moves</TabsTrigger>
                      <TabsTrigger value="chat" className="flex-1">Live Chat</TabsTrigger>
                      <TabsTrigger value="analysis" className="flex-1">Analysis</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="moves" className="border border-[rgba(255,255,255,0.1)] rounded-md mt-2 p-4 bg-chess-dark min-h-[12rem]">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1 font-medium text-gray-300 text-center">Move</div>
                        <div className="col-span-1 font-medium text-gray-300 text-center">White</div>
                        <div className="col-span-1 font-medium text-gray-300 text-center">Black</div>
                        
                        <div className="col-span-1 text-center">1</div>
                        <div className="col-span-1 text-center text-chess-text-light">e4</div>
                        <div className="col-span-1 text-center text-chess-text-light">e5</div>
                        
                        <div className="col-span-1 text-center">2</div>
                        <div className="col-span-1 text-center text-chess-text-light">Nf3</div>
                        <div className="col-span-1 text-center text-chess-text-light">Nc6</div>
                        
                        <div className="col-span-1 text-center">3</div>
                        <div className="col-span-1 text-center text-chess-text-light">Bb5</div>
                        <div className="col-span-1 text-center text-chess-text-light">a6</div>
                        
                        <div className="col-span-1 text-center">4</div>
                        <div className="col-span-1 text-center text-chess-text-light">Ba4</div>
                        <div className="col-span-1 text-center text-chess-text-light">Nf6</div>
                        
                        <div className="col-span-1 text-center">5</div>
                        <div className="col-span-1 text-center text-chess-text-light">O-O</div>
                        <div className="col-span-1 text-center text-chess-text-light">Be7</div>
                        
                        <div className="col-span-1 text-center">6</div>
                        <div className="col-span-1 text-center text-chess-text-light">Re1</div>
                        <div className="col-span-1 text-center text-chess-text-light">b5</div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="chat" className="border border-[rgba(255,255,255,0.1)] rounded-md mt-2 p-4 bg-chess-dark min-h-[12rem]">
                      <div className="space-y-3 max-h-[12rem] overflow-y-auto mb-4">
                        <div className="flex">
                          <span className="font-medium text-chess-accent mr-2">ChessFan123:</span>
                          <span className="text-gray-300">Great opening by white!</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-chess-accent mr-2">MasterAnalyst:</span>
                          <span className="text-gray-300">I think black missed a tactic on move 14</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-chess-accent mr-2">ChessFan123:</span>
                          <span className="text-gray-300">The position is completely equal according to the engine</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-green-500 mr-2">Moderator:</span>
                          <span className="text-gray-300">Please keep the chat respectful</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-chess-accent mr-2">KnightRider:</span>
                          <span className="text-gray-300">Black should play h6 here to prevent Bg5</span>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 px-3 py-2 bg-chess-dark border border-[rgba(255,255,255,0.2)] rounded-l-md text-chess-text-light focus:outline-none focus:border-chess-accent"
                        />
                        <Button className="rounded-l-none bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="analysis" className="border border-[rgba(255,255,255,0.1)] rounded-md mt-2 p-4 bg-chess-dark min-h-[12rem]">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-chess-text-light">Stockfish Analysis</h3>
                        <span className="text-gray-400">Depth: 20</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-chess-accent/10 border border-chess-accent rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-chess-accent text-lg">Qb3</span>
                            <span className="font-mono text-green-500">+0.32</span>
                          </div>
                          <div className="text-sm text-gray-300 font-mono">
                            Qb3 Nc4 Qxc4 bxc4 e5 Nd5 Nxd5 cxd5
                          </div>
                        </div>
                        
                        <div className="p-3 bg-chess-dark/30 border border-[rgba(255,255,255,0.1)] rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-chess-accent text-lg">Qc2</span>
                            <span className="font-mono text-green-500">+0.24</span>
                          </div>
                          <div className="text-sm text-gray-300 font-mono">
                            Qc2 Bd7 Rad1 Qc7 d5 Nb8 Nd4
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="mt-4 border-chess-accent text-chess-accent hover:bg-chess-accent/10" 
                        variant="outline"
                        onClick={() => navigate(`/analysis?fen=${encodeURIComponent(selectedGame.fen)}`)}
                      >
                        Open in Analysis Board
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                <Eye className="h-16 w-16 mb-4 opacity-40" />
                <h2 className="text-2xl font-medium mb-2">Select a game to watch</h2>
                <p className="text-gray-500">Choose from the list of live games on the left</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Spectate;
