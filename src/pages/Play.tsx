
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const Play = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-chess-dark">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-chess-text-light mb-8">Play Chess</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-chess-beige-100 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-chess-text-dark mb-2">Quick Play</h3>
              <p className="text-gray-700 mb-4">Jump into a game with a random opponent.</p>
              <Button className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                Find Match
              </Button>
            </div>

            <div className="bg-chess-beige-100 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-chess-text-dark mb-2">Play with Friend</h3>
              <p className="text-gray-700 mb-4">Challenge a friend to a game of chess.</p>
              <Button className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                Create Game
              </Button>
            </div>

            <div className="bg-chess-beige-100 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-chess-text-dark mb-2">Play with AI</h3>
              <p className="text-gray-700 mb-4">Test your skills against our artificial intelligence.</p>
              <Button className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                Start Game
              </Button>
            </div>

            <div className="bg-chess-beige-100 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-chess-text-dark mb-2">Tournaments</h3>
              <p className="text-gray-700 mb-4">Compete with players from around the world.</p>
              <Button className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                Browse Tournaments
              </Button>
            </div>

            <div className="bg-chess-beige-100 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-chess-text-dark mb-2">Analysis</h3>
              <p className="text-gray-700 mb-4">Review and analyze your chess games.</p>
              <Button className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                Open Analysis Board
              </Button>
            </div>

            <div className="bg-chess-beige-100 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-chess-text-dark mb-2">Spectate</h3>
              <p className="text-gray-700 mb-4">Watch live games from top players.</p>
              <Button className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                Browse Live Games
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Play;
