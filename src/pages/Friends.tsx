
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, MessageCircle, Trophy, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock friends data
const MOCK_FRIENDS = [
  { 
    id: 'friend-1', 
    name: 'Alice Champion', 
    rating: 1920, 
    country: 'USA', 
    online: true, 
    lastSeen: null,
    gamesPlayed: 25,
    winRate: 68
  },
  { 
    id: 'friend-2', 
    name: 'Bob Knight', 
    rating: 1780, 
    country: 'UK', 
    online: false, 
    lastSeen: '2 hours ago',
    gamesPlayed: 18,
    winRate: 72
  },
  { 
    id: 'friend-3', 
    name: 'Carol Queen', 
    rating: 2050, 
    country: 'Germany', 
    online: true, 
    lastSeen: null,
    gamesPlayed: 42,
    winRate: 65
  },
  { 
    id: 'friend-4', 
    name: 'David Rook', 
    rating: 1650, 
    country: 'France', 
    online: false, 
    lastSeen: '1 day ago',
    gamesPlayed: 12,
    winRate: 58
  },
  { 
    id: 'friend-5', 
    name: 'Eva Bishop', 
    rating: 1890, 
    country: 'Spain', 
    online: true, 
    lastSeen: null,
    gamesPlayed: 31,
    winRate: 74
  },
];

const MOCK_PENDING_REQUESTS = [
  { id: 'req-1', name: 'Frank Pawn', rating: 1720, country: 'Italy' },
  { id: 'req-2', name: 'Grace Castle', rating: 1840, country: 'Canada' },
];

const Friends = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState(MOCK_FRIENDS);
  const [pendingRequests, setPendingRequests] = useState(MOCK_PENDING_REQUESTS);

  const handleChallenge = (friendId: string, friendName: string) => {
    toast.success(`Challenge sent to ${friendName}!`);
    // In a real app, this would send a game challenge
  };

  const handleMessage = (friendId: string, friendName: string) => {
    toast.info(`Opening chat with ${friendName}...`);
    // In a real app, this would open a chat window
  };

  const handleAcceptRequest = (requestId: string, userName: string) => {
    // Move from pending to friends
    const request = pendingRequests.find(req => req.id === requestId);
    if (request) {
      const newFriend = {
        ...request,
        online: Math.random() > 0.5,
        lastSeen: Math.random() > 0.5 ? null : '1 minute ago',
        gamesPlayed: 0,
        winRate: 0
      };
      setFriends(prev => [...prev, newFriend]);
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      toast.success(`${userName} is now your friend!`);
    }
  };

  const handleDeclineRequest = (requestId: string, userName: string) => {
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    toast.info(`Declined friend request from ${userName}`);
  };

  const onlineFriends = friends.filter(friend => friend.online);
  const offlineFriends = friends.filter(friend => !friend.online);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-chess-text-light mb-2 flex items-center">
              <Users className="h-8 w-8 mr-3 text-chess-accent" />
              Friends
            </h1>
            <p className="text-gray-400">Manage your chess friends and challenges</p>
          </div>
          
          <Button
            onClick={() => navigate('/add-friend')}
            className="bg-chess-accent text-chess-text-light hover:bg-opacity-90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Friend
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8">
          <Button
            variant={activeTab === 'friends' ? 'default' : 'outline'}
            onClick={() => setActiveTab('friends')}
            className={activeTab === 'friends' 
              ? 'bg-chess-accent text-chess-text-light' 
              : 'border-chess-accent text-chess-accent hover:bg-chess-accent/10'
            }
          >
            Friends ({friends.length})
          </Button>
          <Button
            variant={activeTab === 'requests' ? 'default' : 'outline'}
            onClick={() => setActiveTab('requests')}
            className={activeTab === 'requests' 
              ? 'bg-chess-accent text-chess-text-light' 
              : 'border-chess-accent text-chess-accent hover:bg-chess-accent/10'
            }
          >
            Requests ({pendingRequests.length})
          </Button>
        </div>

        {activeTab === 'friends' && (
          <div className="space-y-6">
            {/* Online Friends */}
            {onlineFriends.length > 0 && (
              <div className="bg-chess-dark border border-[rgba(255,255,255,0.1)] rounded-lg p-6">
                <h2 className="text-xl font-bold text-chess-text-light mb-4 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Online ({onlineFriends.length})
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {onlineFriends.map((friend) => (
                    <div 
                      key={friend.id}
                      className="p-4 bg-chess-beige-100/10 rounded-lg hover:bg-chess-beige-100/20 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-chess-accent/30 flex items-center justify-center text-chess-text-dark font-bold">
                            {friend.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 
                              className="text-chess-text-light font-semibold cursor-pointer hover:text-chess-accent transition-colors"
                              onClick={() => navigate(`/profile/${friend.id}`)}
                            >
                              {friend.name}
                            </h3>
                            <p className="text-gray-400 text-sm">Rating: {friend.rating}</p>
                          </div>
                        </div>
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div className="text-gray-400">
                          Games: <span className="text-chess-text-light">{friend.gamesPlayed}</span>
                        </div>
                        <div className="text-gray-400">
                          Win Rate: <span className="text-chess-text-light">{friend.winRate}%</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleChallenge(friend.id, friend.name)}
                          className="bg-chess-accent text-chess-text-light hover:bg-opacity-90 flex-1"
                        >
                          <Trophy className="h-4 w-4 mr-1" />
                          Challenge
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMessage(friend.id, friend.name)}
                          className="border-chess-accent text-chess-accent hover:bg-chess-accent/10"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offline Friends */}
            {offlineFriends.length > 0 && (
              <div className="bg-chess-dark border border-[rgba(255,255,255,0.1)] rounded-lg p-6">
                <h2 className="text-xl font-bold text-chess-text-light mb-4 flex items-center">
                  <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                  Offline ({offlineFriends.length})
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offlineFriends.map((friend) => (
                    <div 
                      key={friend.id}
                      className="p-4 bg-chess-beige-100/5 rounded-lg hover:bg-chess-beige-100/10 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-gray-300 font-bold">
                            {friend.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 
                              className="text-chess-text-light font-semibold cursor-pointer hover:text-chess-accent transition-colors"
                              onClick={() => navigate(`/profile/${friend.id}`)}
                            >
                              {friend.name}
                            </h3>
                            <p className="text-gray-400 text-sm">Rating: {friend.rating}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-400 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {friend.lastSeen}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div className="text-gray-400">
                          Games: <span className="text-chess-text-light">{friend.gamesPlayed}</span>
                        </div>
                        <div className="text-gray-400">
                          Win Rate: <span className="text-chess-text-light">{friend.winRate}%</span>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMessage(friend.id, friend.name)}
                        className="border-gray-500 text-gray-400 hover:bg-gray-700 w-full"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {friends.length === 0 && (
              <div className="bg-chess-dark border border-[rgba(255,255,255,0.1)] rounded-lg p-12 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-chess-text-light mb-2">No friends yet</h3>
                <p className="text-gray-400 mb-6">Start building your chess network by adding friends!</p>
                <Button
                  onClick={() => navigate('/add-friend')}
                  className="bg-chess-accent text-chess-text-light hover:bg-opacity-90"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Your First Friend
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-chess-dark border border-[rgba(255,255,255,0.1)] rounded-lg p-6">
            <h2 className="text-xl font-bold text-chess-text-light mb-4">
              Pending Friend Requests
            </h2>
            
            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div 
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-chess-beige-100/10 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-chess-accent/30 flex items-center justify-center text-chess-text-dark font-bold">
                        {request.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-chess-text-light font-semibold">{request.name}</h3>
                        <p className="text-gray-400 text-sm">Rating: {request.rating} • {request.country}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptRequest(request.id, request.name)}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeclineRequest(request.id, request.name)}
                        className="border-red-500 text-red-500 hover:bg-red-500/10"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No pending friend requests</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Friends;
