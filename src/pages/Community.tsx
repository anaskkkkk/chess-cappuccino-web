import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Community = () => {
  const navigate = useNavigate();

  const handleViewLeaderboard = () => {
    toast.info('Loading full leaderboard...');
    // In a real app, this would navigate to a dedicated leaderboard page
    navigate('/leaderboard');
  };

  const handleViewTournaments = () => {
    toast.info('Loading tournament listings...');
    navigate('/tournaments');
  };

  const handleAddFriend = () => {
    toast.info('Add friend feature coming soon!');
    // In a real app, this would open a modal to add a friend
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-chess-text-light mb-8 animate-fade-in">Community</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-chess-beige-100 rounded-lg shadow-lg mb-8 hover-lift animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-chess-text-dark">Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="py-2 px-4 text-left text-chess-text-dark">Rank</th>
                        <th className="py-2 px-4 text-left text-chess-text-dark">Player</th>
                        <th className="py-2 px-4 text-left text-chess-text-dark">Rating</th>
                        <th className="py-2 px-4 text-left text-chess-text-dark">Games</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b border-gray-200 hover:bg-chess-beige-300/30 transition-colors">
                          <td className="py-3 px-4 text-gray-700">{i + 1}</td>
                          <td className="py-3 px-4 text-gray-700">
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <span className="cursor-pointer text-chess-accent hover:underline">
                                  Player {i + 1}
                                </span>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80 bg-chess-beige-100 border border-chess-accent/20">
                                <div className="flex justify-between space-x-4">
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">Player {i + 1}</h4>
                                    <div className="text-xs">
                                      <div className="text-gray-700">Rating: {1800 - i * 25}</div>
                                      <div className="text-gray-700">Games: {100 - i * 10}</div>
                                      <div className="text-gray-700">Wins: {65 - i * 7}</div>
                                      <div className="text-gray-700">Member since: April {2022 - i}, 2023</div>
                                    </div>
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{1800 - i * 25}</td>
                          <td className="py-3 px-4 text-gray-700">{100 - i * 10}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="text-right">
                <Button 
                  className="bg-chess-accent text-chess-text-light hover:bg-opacity-90 active:scale-[0.98]"
                  onClick={handleViewLeaderboard}
                >
                  View Full Leaderboard
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-chess-beige-100 rounded-lg shadow-lg hover-lift animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-chess-text-dark">Recent Tournaments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-b border-gray-200 pb-4 hover:bg-chess-beige-300/30 transition-colors rounded-md p-2">
                      <h3 className="font-bold text-chess-text-dark hover:text-chess-accent transition-colors cursor-pointer" onClick={() => navigate(`/tournaments/weekend-blitz-${i+1}`)}>
                        Weekend Blitz {i + 1}
                      </h3>
                      <p className="text-gray-700 text-sm">April {10 + i}, 2025 • 64 players</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="text-right">
                <Button 
                  className="bg-chess-accent text-chess-text-light hover:bg-opacity-90 active:scale-[0.98]"
                  onClick={handleViewTournaments}
                >
                  View All Tournaments
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="bg-chess-beige-100 rounded-lg shadow-lg mb-8 hover-lift animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-chess-text-dark">Friends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between hover:bg-chess-beige-300/30 transition-colors rounded-md p-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-chess-accent/30 flex items-center justify-center text-xs text-chess-text-dark mr-3">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span 
                          className="text-chess-text-dark hover:text-chess-accent transition-colors cursor-pointer"
                          onClick={() => navigate(`/profile/friend-${i+1}`)}
                        >
                          Friend {i + 1}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
                        <span className="text-xs text-gray-700">{i % 2 === 0 ? 'Online' : 'Offline'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90 active:scale-[0.98]"
                  onClick={handleAddFriend}
                >
                  Add Friend
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-chess-beige-100 rounded-lg shadow-lg hover-lift animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-chess-text-dark">Featured Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="flex items-center hover:bg-chess-beige-300/30 transition-colors rounded-md p-2 cursor-pointer"
                      onClick={() => navigate(`/profile/grandmaster-${i+1}`)}
                    >
                      <div className="w-10 h-10 rounded-full bg-chess-accent/50 flex items-center justify-center text-sm text-chess-text-dark mr-3">
                        GM
                      </div>
                      <div>
                        <p className="text-chess-text-dark font-medium hover:text-chess-accent transition-colors">
                          Grandmaster {i + 1}
                        </p>
                        <p className="text-xs text-gray-700">Rating: {2700 - i * 50}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
