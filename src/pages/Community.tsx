
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const Community = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-chess-dark">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-chess-text-light mb-8">Community</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-chess-beige-100 rounded-lg p-6 shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-chess-text-dark mb-4">Leaderboard</h2>
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
                        <tr key={i} className="border-b border-gray-200">
                          <td className="py-3 px-4 text-gray-700">{i + 1}</td>
                          <td className="py-3 px-4 text-gray-700">Player {i + 1}</td>
                          <td className="py-3 px-4 text-gray-700">{1800 - i * 25}</td>
                          <td className="py-3 px-4 text-gray-700">{100 - i * 10}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-right">
                  <Button className="bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                    View Full Leaderboard
                  </Button>
                </div>
              </div>
              
              <div className="bg-chess-beige-100 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-chess-text-dark mb-4">Recent Tournaments</h2>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-b border-gray-200 pb-4">
                      <h3 className="font-bold text-chess-text-dark">Weekend Blitz {i + 1}</h3>
                      <p className="text-gray-700 text-sm">April {10 + i}, 2025 • 64 players</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <Button className="bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                    View All Tournaments
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-chess-beige-100 rounded-lg p-6 shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-chess-text-dark mb-4">Friends</h2>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-chess-accent/30 flex items-center justify-center text-xs text-chess-text-dark mr-3">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-chess-text-dark">Friend {i + 1}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
                        <span className="text-xs text-gray-700">{i % 2 === 0 ? 'Online' : 'Offline'}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                    Add Friend
                  </Button>
                </div>
              </div>
              
              <div className="bg-chess-beige-100 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-chess-text-dark mb-4">Featured Players</h2>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-chess-accent/50 flex items-center justify-center text-sm text-chess-text-dark mr-3">
                        GM
                      </div>
                      <div>
                        <p className="text-chess-text-dark font-medium">Grandmaster {i + 1}</p>
                        <p className="text-xs text-gray-700">Rating: {2700 - i * 50}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Community;
