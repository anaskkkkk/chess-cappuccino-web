
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Search, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';

// Mock leaderboard data
const MOCK_LEADERBOARD = Array.from({ length: 50 }, (_, i) => ({
  id: `player-${i + 1}`,
  rank: i + 1,
  name: `Player ${i + 1}`,
  rating: 2000 - i * 15,
  games: 150 - i * 2,
  wins: 100 - i,
  country: ['USA', 'UK', 'Germany', 'France', 'Spain'][i % 5],
  title: i < 5 ? 'GM' : i < 15 ? 'IM' : i < 30 ? 'FM' : null
}));

const Leaderboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('monthly');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredPlayers = MOCK_LEADERBOARD.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-chess-text-light mb-4 flex items-center">
          <Trophy className="h-8 w-8 mr-3 text-chess-accent" />
          Global Leaderboard
        </h1>
        <p className="text-gray-400 mb-8">Top players ranked by rating and performance</p>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-chess-dark border border-[rgba(255,255,255,0.2)] rounded-md text-chess-text-light focus:outline-none focus:border-chess-accent"
            />
          </div>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px] bg-chess-dark border-[rgba(255,255,255,0.2)] text-chess-text-light">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-chess-dark border-[rgba(255,255,255,0.2)]">
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-chess-dark border border-[rgba(255,255,255,0.1)] rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[rgba(255,255,255,0.1)]">
                <TableHead className="text-chess-text-light">Rank</TableHead>
                <TableHead className="text-chess-text-light">Player</TableHead>
                <TableHead className="text-chess-text-light">Rating</TableHead>
                <TableHead className="text-chess-text-light">Games</TableHead>
                <TableHead className="text-chess-text-light">Wins</TableHead>
                <TableHead className="text-chess-text-light">Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPlayers.map((player) => (
                <TableRow 
                  key={player.id}
                  className="border-b border-[rgba(255,255,255,0.1)] hover:bg-chess-beige-300/10 cursor-pointer"
                  onClick={() => navigate(`/profile/${player.id}`)}
                >
                  <TableCell className="text-chess-text-light">
                    <div className="flex items-center gap-2">
                      {getRankIcon(player.rank)}
                      <span className={`font-bold ${player.rank <= 3 ? 'text-chess-accent' : ''}`}>
                        #{player.rank}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-chess-text-light">
                    <div className="flex items-center gap-2">
                      {player.title && (
                        <span className="px-2 py-1 text-xs bg-chess-accent/20 text-chess-accent rounded">
                          {player.title}
                        </span>
                      )}
                      <span className="hover:text-chess-accent transition-colors">
                        {player.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-chess-text-light font-mono">
                    {player.rating}
                  </TableCell>
                  <TableCell className="text-chess-text-light">
                    {player.games}
                  </TableCell>
                  <TableCell className="text-chess-text-light">
                    {player.wins}
                  </TableCell>
                  <TableCell className="text-chess-text-light">
                    {player.country}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="border-chess-accent text-chess-accent hover:bg-chess-accent/10"
            >
              Previous
            </Button>
            
            <span className="flex items-center px-4 text-chess-text-light">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="border-chess-accent text-chess-accent hover:bg-chess-accent/10"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Leaderboard;
