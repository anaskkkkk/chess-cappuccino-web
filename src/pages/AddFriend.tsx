
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { UserPlus, Search, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Mock search results
const MOCK_USERS = [
  { id: 'user-1', name: 'ChessMaster2024', rating: 1850, country: 'USA', online: true },
  { id: 'user-2', name: 'QueenGambit', rating: 1920, country: 'UK', online: false },
  { id: 'user-3', name: 'KnightRider', rating: 1780, country: 'Germany', online: true },
  { id: 'user-4', name: 'RookiePlayer', rating: 1650, country: 'France', online: false },
  { id: 'user-5', name: 'BishopMoves', rating: 1950, country: 'Spain', online: true },
];

const AddFriend = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof MOCK_USERS>([]);
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a username to search');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = MOCK_USERS.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setLoading(false);
      
      if (results.length === 0) {
        toast.info('No users found with that username');
      }
    }, 500);
  };

  const handleAddFriend = async (userId: string, userName: string) => {
    setPendingRequests(prev => new Set([...prev, userId]));
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Friend request sent to ${userName}!`);
      setPendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-chess-text-light mb-4 flex items-center">
          <UserPlus className="h-8 w-8 mr-3 text-chess-accent" />
          Add Friends
        </h1>
        <p className="text-gray-400 mb-8">Find and connect with other chess players</p>

        {/* Search */}
        <div className="bg-chess-dark border border-[rgba(255,255,255,0.1)] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-chess-text-light mb-4">Search for Players</h2>
          
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Enter username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 bg-chess-beige-100 border border-[rgba(255,255,255,0.2)] rounded-md text-chess-text-dark focus:outline-none focus:border-chess-accent"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-chess-accent text-chess-text-light hover:bg-opacity-90 px-8"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-chess-dark border border-[rgba(255,255,255,0.1)] rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-chess-text-light mb-4">Search Results</h2>
            
            <div className="space-y-4">
              {searchResults.map((user) => (
                <div 
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-chess-beige-100/10 rounded-lg hover:bg-chess-beige-100/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-chess-accent/30 flex items-center justify-center text-chess-text-dark font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 
                          className="text-chess-text-light font-semibold cursor-pointer hover:text-chess-accent transition-colors"
                          onClick={() => navigate(`/profile/${user.id}`)}
                        >
                          {user.name}
                        </h3>
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-400'} mr-1`}></span>
                          <span className="text-xs text-gray-400">{user.online ? 'Online' : 'Offline'}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">Rating: {user.rating} • {user.country}</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAddFriend(user.id, user.name)}
                    disabled={pendingRequests.has(user.id)}
                    className="bg-chess-accent text-chess-text-light hover:bg-opacity-90"
                  >
                    {pendingRequests.has(user.id) ? 'Sending...' : 'Add Friend'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-chess-dark border border-[rgba(255,255,255,0.1)] rounded-lg p-6">
          <h2 className="text-xl font-bold text-chess-text-light mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/friends')}
              className="border-chess-accent text-chess-accent hover:bg-chess-accent/10 p-6 h-auto flex items-center justify-center gap-3"
            >
              <Users className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold">View Friends</div>
                <div className="text-sm opacity-70">See your current friends list</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => toast.info('Friend recommendations coming soon!')}
              className="border-chess-accent text-chess-accent hover:bg-chess-accent/10 p-6 h-auto flex items-center justify-center gap-3"
            >
              <UserPlus className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold">Suggestions</div>
                <div className="text-sm opacity-70">Find recommended players</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddFriend;
